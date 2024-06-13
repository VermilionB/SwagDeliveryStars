import {Injectable} from '@nestjs/common';
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
        accessKeyId: 'cad483a6-acd1-4498-9975-86d7f2518701',
        secretAccessKey: '67d38449c21495d6239791cb0d40610504b3cbf468c446caae3e2d5719e2088f'
    },
    endpoint: 'https://s3.aeza.cloud',
    forcePathStyle: true,
    apiVersion: 'latest',
});

// const s3Client = new S3Client({
//     region: "ru-1", // Замените на ваш регион
//     credentials: {
//         accessKeyId: 'a4e01a924987414fb84a35e9a1e46d76', // Замените на ваш Access Key ID
//         secretAccessKey: '91c6ff2f3fdb4b42ade3a1c39367848d' // Замените на ваш Secret Access Key
//     },
//     endpoint: 'https://s3.ru-1.storage.selcloud.ru/', // Замените на ваш endpoint, если необходимо
//     forcePathStyle: true,
//     apiVersion: 'latest',
// });


@Injectable()
export class FileUploadService {
    private readonly bucketName: string

    constructor(private readonly avatarGenerator: AvatarGeneratorService) {
        this.bucketName = "tenuous-army"
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
            return Math.round(metadata.format.duration);
        } catch (error) {
            console.error('Ошибка при анализе метаданных аудиофайла:', error.message);
            return null;
        }
    }
}
