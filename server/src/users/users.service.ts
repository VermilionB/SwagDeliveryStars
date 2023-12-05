import {HttpException, Injectable, NotFoundException} from '@nestjs/common';
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

    async getAll() {
        return this.prisma.users.findMany();
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
        let hashedPassword: string
        let newAvatarUrl: string
        const existingUser = await this.prisma.users.findUnique({
            where: {id}
        })
        if(existingUser){
            console.log(existingUser)
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
            if(updatedData.password) {
                hashedPassword = await argon2.hash(updatedData.password);
            }
            if (file) {
                newAvatarUrl = await this.uploadImage.updateFile(file, existingUser.avatar_url);
            }

            return this.prisma.users.update({
                where: {id},
                data: {
                    email: updatedData.email,
                    password: hashedPassword,
                    username: updatedData.username,
                    avatar_url: newAvatarUrl,
                    bio: updatedData.bio,
                    contact_info: updatedData.contact_info
                },
            });
        }
        else throw new NotFoundException(`Пользователя с таким идентификатором ${id} не существует`);
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
        return this.prisma.users.findUnique({
            where: { id },
            include: {
                followers_followers_who_followsTousers: true,
                followers_followers_who_followedTousers: true,
                plays: true,
                beats: {
                    include: {
                        users: true,
                        licenses: true,
                        genres: true,
                        beat_files: true
                    }
                },
            } as any,
        });
    }

    async followUser(id, currentUserId: string) {
        const existingUser = await this.prisma.users.findUnique({
            where: {id: id.id}
        })
        const alreadyFollowed = await this.prisma.followers.findUnique({
            where: {
                who_follows_who_followed: {
                    who_follows: currentUserId,
                    who_followed: id.id,
                },
            },
        });
        if(existingUser && !alreadyFollowed) {
            if(id !== currentUserId){
                return this.prisma.followers.create({
                    data: {
                        who_followed: id.id,
                        who_follows: currentUserId
                    }
                })
            } else throw new NotFoundException(`Невозможно подписаться на себя`);
        } else throw new NotFoundException(`Пользователя с таким идентификатором ${id} не существует`);
    }

    async unfollowUser(id, currentUserId: string) {
        const alreadyFollowed = await this.prisma.followers.findUnique({
            where: {
                who_follows_who_followed: {
                    who_follows: currentUserId,
                    who_followed: id.id,
                },
            },
        });

        if(alreadyFollowed) {
            return this.prisma.followers.delete({
                where: {
                    who_follows_who_followed: {
                        who_follows: currentUserId,
                        who_followed: id.id,
                    }
                }
            })
        }
    }

    async findFollowed(id, currentUserId: string) {
        console.log(id.id)
        return this.prisma.followers.findUnique({
            where: {
                who_follows_who_followed: {
                    who_follows: currentUserId,
                    who_followed: id.id,
                }
            }
        });
    }


}
