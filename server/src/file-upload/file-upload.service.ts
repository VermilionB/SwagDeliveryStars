import {Injectable, StreamableFile} from '@nestjs/common';
import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    PutObjectCommandInput,
    S3Client
} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import {AvatarGeneratorService} from "../avatar_generator/avatar_generator.service";
import {v4 as uuidv7} from 'uuid';
import * as sharp from 'sharp';
import * as mm from 'music-metadata'

const s3Client = new S3Client({
    region: "msk",
    credentials: {
        accessKeyId: 'af82df6a-326a-4547-9f35-90162efa01f2',
        secretAccessKey: 'fb19fb6f6284f274df405343fd1b58e74e4f36238c1fea4e06cd6918c0fdcbe5'
    },
    endpoint: 'https://s3.aeza.cloud',
    forcePathStyle: true,
    apiVersion: 'latest',
});

@Injectable()
export class FileUploadService {
    private readonly bucketName: string

    constructor(private readonly avatarGenerator: AvatarGeneratorService) {
        this.bucketName = "deserted-minister"
    }

    async getFileBuffer(file: Express.Multer.File, email?: string): Promise<Buffer> {
        if (file) {
            return await sharp(file.buffer)
                .resize(400, 400)
                .toFormat('webp')
                .toBuffer();
        }
        if (email) {
            const url = this.avatarGenerator.generateGravatarUrl(email);
            const response = await axios.get(url, { responseType: "arraybuffer" });
            return await sharp(response.data)
                .resize(400, 400)
                .toFormat('webp')
                .toBuffer();
        }
        throw new Error("No file or email provided");
    }

    async generateUploadParams(file: Express.Multer.File, email?: string): Promise<PutObjectCommandInput> {
        let body: Buffer;
        const isImageMimeType = (mimeType) => /^image\//.test(mimeType);
        if(file) {
            const mimeType = file.mimetype;
            body = isImageMimeType(mimeType) ? await this.getFileBuffer(file, email) : file.buffer;
        }
        else body = await this.getFileBuffer(file, email)

        return {
            Bucket: this.bucketName,
            Key: `${file ? file.mimetype.split('/')[0] : "image-jpeg"}_${uuidv7()}`,
            Body: body,
            ContentType: file ? file.mimetype : "image/jpeg",
        };
    }

    async uploadFile(file: Express.Multer.File, email?: string): Promise<string> {
        const uploadParams = await this.generateUploadParams(file, email);
        await s3Client.send(new PutObjectCommand(uploadParams));
        return uploadParams.Key
    }

    async deleteFile(key: string): Promise<void> {
        const deleteParams = {
            Bucket: this.bucketName,
            Key: key,
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));
    }

    async updateFile(file: Express.Multer.File, key: string): Promise<string> {
        const uploadParams = {
            Bucket: this.bucketName,
            Key: key,
            Body: await this.getFileBuffer(file),
            ContentType: file.mimetype,
        };

        await s3Client.send(new PutObjectCommand(uploadParams));
        return uploadParams.Key
    }

    async generatePresignedUrl(avatarKey: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: avatarKey,
        });

        const expiresIn =  6 * 23 * 60 * 60;
        return await getSignedUrl(s3Client, command, { expiresIn });
    }

    async getAudioDuration(file: Express.Multer.File) {
        try {
            const metadata = await mm.parseBuffer(file.buffer, 'audio/mpeg');
            const durationInSeconds = Math.round(metadata.format.duration);
            return durationInSeconds;
        } catch (error) {
            console.error('Ошибка при анализе метаданных аудиофайла:', error.message);
            return null;
        }
    }
}
