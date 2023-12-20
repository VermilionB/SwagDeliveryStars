import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {CreateBeatDto} from "./dto/create-beat.dto";
import {FileUploadService} from "../file-upload/file-upload.service";
import {v4 as uuidv7} from 'uuid';
import {Decimal} from '@prisma/client/runtime/library';
import {UpdateBeatDto} from "./dto/update-beat.dto";

@Injectable()
export class BeatsService {
    constructor(private readonly prisma: PrismaService,
                private readonly uploadFiles: FileUploadService) {
    }

    async create(dto: CreateBeatDto, producerId: string, files) {
        const producerBanned = await this.prisma.users.findFirst({
            where: {
                id: producerId
            },
            select: {
                is_banned: true
            }
        })

        if (producerBanned.is_banned) {
            throw new NotFoundException("User is banned and cannot post beats");
        }

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


    async getAllBeats(
        page: number,
        pageSize: number,
        beatName: string = '',
        priceFrom: number = 0,
        priceTo: number = Number.MAX_SAFE_INTEGER,
        isFree: boolean | null = null
    ) {
        const skip: number = (page - 1) * pageSize;

        const whereCondition: {
            name?: { contains: string; mode: 'insensitive' };
            licenses?: { some: { price: { gte: number; lte: number } } };
            is_free?: boolean | null;
            is_available: boolean;
        } = {
            is_available: true,
        };

        if (beatName) {
            whereCondition.name = { contains: beatName, mode: 'insensitive' };
        }

        if (!priceFrom) {
            priceFrom = 0;
        }

        // Если priceTo не указан, установите его в максимальное значение
        if (!priceTo) {
            priceTo = Number.MAX_SAFE_INTEGER;
        }

        if (priceFrom > 0 || priceTo > 0) {
            whereCondition.licenses = {
                some: { price: { gte: priceFrom, lte: priceTo } },
            };
        }


        if (isFree !== null) {
            whereCondition.is_free = isFree;
        }

        return this.prisma.beats.findMany({
            where: whereCondition,
            skip: skip,
            take: pageSize,
            select: {
                id: true,
                name: true,
                users: {
                    select: {
                        username: true,
                    },
                },
                image_url: true,
                duration: true,
                bpm: true,
                keys: {
                    select: {
                        key: true,
                    },
                },
                genres: {
                    select: {
                        genre: true,
                    },
                },
                likes: true,
                is_free: true,
                is_available: true,
                licenses: {
                    select: {
                        license_type: true,
                        price: true,
                    },
                },
            },
        });
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
                _count: {
                    select: {
                        likes: true,
                        plays: true,
                        reposts: true
                    }
                },
                description: true,
                is_free: true,
                is_available: true,
                tags: true,
                licenses: {
                    select: {
                        id: true,
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
                comments: {
                    select: {
                        users: {
                            select: {
                                id: true,
                                username: true,
                                avatar_url: true,
                                role_id: true
                            }
                        },
                        beat_id: true,
                        comment: true
                    }
                },
                beat_files: {
                    select: {
                        mp3_file: true
                    }
                },

            }
        });
    }

    async playBeat(listenerId: string, beatId: string) {
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

    async getAllBeatsCount(beatName: string = '',
                           priceFrom: number = 0,
                           priceTo: number = Number.MAX_SAFE_INTEGER,
                           isFree: boolean | null = null) {

        const whereCondition: {
            name?: { contains: string; mode: 'insensitive' };
            licenses?: { some: { price: { gte: number; lte: number } } };
            is_free?: boolean | null;
            is_available: boolean;
        } = {
            is_available: true,
        };

        if (beatName) {
            whereCondition.name = { contains: beatName, mode: 'insensitive' };
        }

        if (priceFrom > 0 || priceTo > 0) {
            whereCondition.licenses = {
                some: { price: { gte: priceFrom, lte: priceTo } },
            };
        }

        if (isFree !== null) {
            whereCondition.is_free = isFree;
        }

        return this.prisma.beats.count({
            where: whereCondition
        })
    }

    async likeBeat(userId: string, beatId: string) {
        const alreadyLiked = await this.prisma.likes.findUnique({
            where: {
                user_id_beat_id: {
                    user_id: userId,
                    beat_id: beatId
                }
            },
        });

        if (!alreadyLiked) {
            return this.prisma.likes.create({
                data: {
                    user_id: userId,
                    beat_id: beatId,
                },
            });
        }
    }

    async unlikeBeat(userId: string, beatId: string) {
        const alreadyLiked = await this.prisma.likes.findUnique({
            where: {
                user_id_beat_id: {
                    user_id: userId,
                    beat_id: beatId,
                },
            },
        });

        if (alreadyLiked) {
            return this.prisma.likes.delete({
                where: {
                    user_id_beat_id: {
                        user_id: userId,
                        beat_id: beatId,
                    },
                },
            });
        }
    }

    async findLiked(userId: string, beatId: string) {
        return this.prisma.likes.findUnique({
            where: {
                user_id_beat_id: {
                    user_id: userId,
                    beat_id: beatId,
                },
            },
        });
    }


    async repostBeat(userId: string, beatId: string) {
        const alreadyLiked = await this.prisma.reposts.findUnique({
            where: {
                user_id_beat_id: {
                    user_id: userId,
                    beat_id: beatId
                }
            },
        });

        if (!alreadyLiked) {
            return this.prisma.reposts.create({
                data: {
                    user_id: userId,
                    beat_id: beatId,
                },
            });
        }
    }

    async unrepostBeat(userId: string, beatId: string) {
        const alreadyLiked = await this.prisma.reposts.findUnique({
            where: {
                user_id_beat_id: {
                    user_id: userId,
                    beat_id: beatId,
                },
            },
        });

        if (alreadyLiked) {
            return this.prisma.reposts.delete({
                where: {
                    user_id_beat_id: {
                        user_id: userId,
                        beat_id: beatId,
                    },
                },
            });
        }
    }

    async findReposted(userId: string, beatId: string) {
        return this.prisma.reposts.findUnique({
            where: {
                user_id_beat_id: {
                    user_id: userId,
                    beat_id: beatId,
                },
            },
        });
    }


    async updateBeat(dto: UpdateBeatDto, file: Express.Multer.File, userId: string) {
        try {
            const foundProducer = await this.prisma.beats.findFirst({
                where: {
                    producer_id: userId,
                },
                select: {
                    producer_id: true,
                },
            });

            if (userId === foundProducer.producer_id) {
                let imageUrl: string | undefined;

                if (file) {
                    imageUrl = await this.uploadFiles.uploadFile(file);
                }

                const updatedBeat = await this.prisma.beats.update({
                    where: {
                        id: dto.beatId,
                    },
                    data: {
                        name: dto.name,
                        image_url: imageUrl !== undefined ? imageUrl : undefined, // Установите новое значение, только если файл существует
                        description: dto.description,
                        is_free: Boolean(dto.isFree),
                    },
                });

                const licenses = JSON.parse(dto.licenses);
                const licenseTypes = Object.keys(licenses);
                const licensePrices = Object.values(licenses);

                await Promise.all(
                    licenseTypes.map(async (licenseType, i) => {
                        const licensePrice: number = parseFloat(licensePrices[i] as string);
                        await this.prisma.licenses.updateMany({
                            where: {
                                AND: [
                                    {license_type: parseInt(licenseType, 10)},
                                    {beat_id: updatedBeat.id}
                                ]
                            },
                            data: {
                                price: new Decimal(licensePrice),
                            },
                        });
                    })
                );

                return updatedBeat
            } else {
                throw new NotFoundException(`You can't update not your own beat`);
            }
        } catch (err) {
            throw new NotFoundException(`[SERVER] Error while updating beat: ${err}`);
        }
    }

    async deleteBeat(beatId: string, userId: string) {
        try {
            const isAdmin = await this.prisma.users.findUnique({
                where: {
                    id: userId
                },
                select: {
                    roles: {
                        select: {
                            role_name: true
                        }
                    }
                }
            })

            const foundProducer = await this.prisma.beats.findFirst({
                where: {
                    producer_id: userId,
                },
                select: {
                    producer_id: true,
                },
            });

            if (isAdmin.roles.role_name === 'admin' || (isAdmin.roles.role_name === 'admin' && !foundProducer) || userId === foundProducer.producer_id) {
                const foundBeat = await this.prisma.beats.findFirst({
                    where: {
                        id: beatId
                    }
                })

                const foundBeatFiles = await this.prisma.beat_files.findFirst({
                    where: {
                        id: foundBeat.beat_files_id
                    }
                })
                const filesToDelete = [foundBeatFiles.mp3_file, foundBeatFiles.wav_file, foundBeatFiles.zip_file]

                filesToDelete.map(async(file) => {
                    await this.uploadFiles.deleteFile(file)
                })

                // const deleteFiles = this.prisma.beat_files.delete({
                //     where: {
                //         id: foundBeatFiles.id
                //     }
                // })

                return this.prisma.beats.delete({
                    where: {
                        id: beatId
                    }
                })
            } else {
                throw new NotFoundException(`You can't delete not your own beat`);
            }
        } catch (err) {
            throw new NotFoundException(`[SERVER] Error while deleting beat: ${err}`);
        }
    }

}
