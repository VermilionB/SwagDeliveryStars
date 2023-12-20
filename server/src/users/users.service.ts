import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {UpdateUserDto} from "./dto/update-user.dto";
import * as argon2 from 'argon2';
import {v4 as uuidv7} from 'uuid';

import {FileUploadService} from "../file-upload/file-upload.service";
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService, private readonly uploadImage: FileUploadService) {
    }

    async getAll(username: string = '', userId: string | null) {

        if (userId === 'null') {
            return this.prisma.users.findMany({
                where: {
                    is_banned: false,
                    username: {
                        contains: username,
                        mode: 'insensitive'
                    }
                },
                select: {
                    id: true,
                    email: true,
                    avatar_url: true,
                    username: true,
                    is_banned: true
                }
            });
        }

        const requestingUser = await this.prisma.users.findFirst({
            where: {
                id: userId
            },
            select: {
                role_id: true
            }
        });

        if (requestingUser.role_id === 2) {
            return this.prisma.users.findMany({
                where: {
                    username: {
                        contains: username,
                        mode: 'insensitive'
                    }
                },
                select: {
                    id: true,
                    email: true,
                    avatar_url: true,
                    username: true,
                    is_banned: true
                }
            });
        } else {
            return this.prisma.users.findMany({
                where: {
                    is_banned: false,
                    role_id: 1,
                    username: {
                        contains: username,
                        mode: 'insensitive'
                    }
                },
                select: {
                    id: true,
                    email: true,
                    avatar_url: true,
                    username: true,
                    is_banned: true
                }
            });
        }
    }



    async create(dto: CreateUserDto, file?: Express.Multer.File) {
        let avatarUrl: string;
        if (file) {
            avatarUrl = await this.uploadImage.uploadFile(file);
        } else {
            avatarUrl = await this.uploadImage.uploadFile(null, dto.email);
        }

        const linksID = uuidv7();
        await this.prisma.social_links.create({
            data: {
                id: linksID,
                youtube: null,
                facebook: null,
                soundcloud: null,
                twitter: null,
                instagram: null,
                tiktok: null,
                twitch: null,
            },
        });

        const hashedPassword = await argon2.hash(dto.password);
        return this.prisma.users.create({
            data: {
                id: uuidv7(),
                email: dto.email,
                password: hashedPassword,
                username: dto.username,
                avatar_url: avatarUrl,
                social_links: {
                    connect: {
                        id: linksID
                    }
                }
            }
        });
    }

    async updateUser(id: string, updatedData: UpdateUserDto, file?: Express.Multer.File) {
        let newAvatarUrl: string
        const existingUser = await this.prisma.users.findUnique({
            where: {id}
        })
        if (existingUser) {
            await this.prisma.social_links.update({
                where: {
                    id: existingUser.social_links_id
                },
                data: {
                    youtube: updatedData.youtube,
                    facebook: updatedData.facebook,
                    soundcloud: updatedData.soundcloud,
                    twitter: updatedData.twitter,
                    instagram: updatedData.instagram,
                    tiktok: updatedData.tiktok,
                    twitch: updatedData.twitch
                }
            })

            if (file) {
                newAvatarUrl = await this.uploadImage.updateFile(file, existingUser.avatar_url);
            }

            return this.prisma.users.update({
                where: {id},
                data: {
                    email: updatedData.email,
                    username: updatedData.username,
                    avatar_url: newAvatarUrl,
                    bio: updatedData.bio,
                    contact_info: updatedData.contact_info
                },
            });
        } else throw new NotFoundException(`User with such id ${id} not exists`);
    }

    async deleteUser(id: string) {
        return this.prisma.users.delete({
            where: {
                id: id
            },
        });
    }

    async getUserByEmail(email: string) {
        return this.prisma.users.findUnique({
            where: {
                email: email
            }
        })
    }

    async getUserById(id: string) {
        const user = await this.prisma.users.findUnique({
            where: { id },
            include: {
                followers_followers_who_followsTousers: true,
                followers_followers_who_followedTousers: true,
                beats: {
                    include: {
                        users: true,
                        licenses: true,
                        genres: true,
                        beat_files: true,
                    },
                },
                reposts: {
                    select: {
                        beats: {
                            include: {
                                users: true,
                                licenses: true,
                                genres: true,
                                beat_files: true,
                            },
                        },
                    },
                },
                social_links: true
            },
        });

        if (!user) {
            return null;
        }

        let totalPlays = 0;

        for (const beat of user.beats) {
            const playsCount = await this.prisma.plays.count({
                where: { beat_id: beat.id },
            });
            totalPlays += playsCount;
        }

        return { user, totalPlays };
    }

    async followUser(id: string, currentUserId: string) {
        const existingUser = await this.prisma.users.findUnique({
            where: {id: id}
        })
        const alreadyFollowed = await this.prisma.followers.findUnique({
            where: {
                who_follows_who_followed: {
                    who_follows: currentUserId,
                    who_followed: id,
                },
            },
        });
        if (existingUser && !alreadyFollowed) {
            if (id !== currentUserId) {
                return this.prisma.followers.create({
                    data: {
                        who_followed: id,
                        who_follows: currentUserId
                    }
                })
            } else throw new NotFoundException(`Невозможно подписаться на себя`);
        } else throw new NotFoundException(`Пользователя с таким идентификатором ${id} не существует`);
    }

    async unfollowUser(id: string, currentUserId: string) {
        const alreadyFollowed = await this.prisma.followers.findUnique({
            where: {
                who_follows_who_followed: {
                    who_follows: currentUserId,
                    who_followed: id,
                },
            },
        });

        if (alreadyFollowed) {
            return this.prisma.followers.delete({
                where: {
                    who_follows_who_followed: {
                        who_follows: currentUserId,
                        who_followed: id,
                    }
                }
            })
        }
    }

    async findFollowed(id: string, currentUserId: string) {

        return this.prisma.followers.findUnique({
            where: {
                who_follows_who_followed: {
                    who_follows: currentUserId,
                    who_followed: id,
                }
            }
        });
    }

    async blockUser (userId: string) {
        return this.prisma.users.update({
            where: {
                id: userId
            },
            data: {
                is_banned: true
            }
        })
    }

    async unblockUser (userId: string) {
        return this.prisma.users.update({
            where: {
                id: userId
            },
            data: {
                is_banned: false
            }
        })
    }
}
