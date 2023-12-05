import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {CreateBeatDto} from "./dto/create-beat.dto";
import {FileUploadService} from "../file-upload/file-upload.service";
import {v4 as uuidv7} from 'uuid';
import {Decimal} from '@prisma/client/runtime/library';

@Injectable()
export class BeatsService {
    constructor(private readonly prisma: PrismaService,
                private readonly uploadFiles: FileUploadService) {
    }

    async create(dto: CreateBeatDto, producerId: string, files) {
        if (files) {
            const mp3FilePromise = this.uploadFiles.uploadFile(files.mp3_file[0]);
            const wavFilePromise = this.uploadFiles.uploadFile(files.wav_file[0]);
            const zipFilePromise = this.uploadFiles.uploadFile(files.zip_file[0]);
            const imageUrlPromise = this.uploadFiles.uploadFile(files.image_file[0]);
            const durationMp3Promise = this.uploadFiles.getAudioDuration(files.mp3_file[0]);

            const [mp3_file, wav_file, zip_file, imageUrl, durationMp3] = await Promise.all([
                mp3FilePromise,
                wavFilePromise,
                zipFilePromise,
                imageUrlPromise,
                durationMp3Promise
            ]);

            console.log(mp3_file, wav_file, zip_file, imageUrl);

            const beatFilesId = uuidv7();

            await this.prisma.beat_files.create({
                data: {
                    id: beatFilesId,
                    mp3_file: mp3_file,
                    wav_file: wav_file,
                    zip_file: zip_file
                }
            });

            const newBeat = await this.prisma.beats.create({
                data: {
                    id: uuidv7(),
                    name: dto.name,
                    producer_id: producerId,
                    genre_id: dto.genreId,
                    beat_files_id: beatFilesId,
                    image_url: imageUrl,
                    duration: durationMp3,
                    description: dto.description,
                    bpm: +dto.bpm,
                    key: +dto.key,
                    tags: dto.tags,
                    is_free: Boolean(dto.isFree)
                }
            });

            const licenses = JSON.parse(dto.licenses);
            const licenseTypes = Object.keys(licenses);
            const licensePrices = Object.values(licenses);

            await Promise.all(
                licenseTypes.map(async (licenseType, i) => {
                    const licensePrice: number = parseFloat(licensePrices[i] as string);
                    await this.prisma.licenses.create({
                        data: {
                            id: uuidv7(),
                            beat_id: newBeat.id,
                            license_type: parseInt(licenseType, 10),
                            price: new Decimal(licensePrice)
                        }
                    });
                })
            );

            return {newBeat};
        }
    }


    async getAllBeats(page: number, pageSize: number) {
        console.log(page, pageSize)
        const skip: number = (page - 1) * pageSize;
        return this.prisma.beats.findMany({
            skip: skip,
            take: pageSize,
            select: {
                id: true,
                name: true,
                users: {
                    select: {
                        username: true
                    }
                },
                image_url: true,
                duration: true,
                bpm: true,
                keys: {
                    select: {
                        key: true
                    }
                },
                genres: {
                    select: {
                        genre: true
                    }
                },
                likes: true,
                is_free: true,
                is_available: true,
                licenses: {
                    select: {
                        license_type: true,
                        price: true
                    }
                }
            }
        })
    }

    async getBeatById(id: string) {
        return this.prisma.beats.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                users: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                image_url: true,
                duration: true,
                bpm: true,
                keys: {
                    select: {
                        key: true
                    }
                },
                genres: {
                    select: {
                        genre: true
                    }
                },
                likes: true,
                description: true,
                is_free: true,
                is_available: true,
                tags: true,
                licenses: {
                    select: {
                        id:true,
                        license_types: {
                            select: {
                                id: true,
                                license_type: true,
                                description: true
                            }
                        },
                        price: true
                    }
                },
                ratings_reviews: {
                    select: {
                        rating: true,
                        comment: true,
                        users: {
                            select: {
                                username: true,
                                avatar_url: true,
                                is_banned: true
                            }
                        }
                    }
                },
                beat_files: {
                    select: {
                        mp3_file: true
                    }
                },
                plays: true
            }
        })
    }

    async playBeat (listenerId: string, beatId: string) {
        const existingPlay = await this.prisma.plays.findFirst({
            where: {
                beat_id: beatId,
                listener_id: listenerId,
            },
        });

        if (existingPlay) {
            return;
        }

        return this.prisma.plays.create({
            data: {
                beat_id: beatId,
                listener_id: listenerId,
            },
        });
    }

    async getAllBeatsCount () {
        return this.prisma.beats.count()
    }
}
