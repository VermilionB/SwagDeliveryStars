import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {CreateRatingDto} from "../ratings/dto/create-rating.dto";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {v4 as uuidv7} from 'uuid';

@Injectable()
export class CommentsService {
    constructor(private readonly prisma: PrismaService) {}

    async createComment(dto: CreateCommentDto, beatId: string, userId: string) {
        const commentId = uuidv7()

        await this.prisma.comments.create({
            data: {
                id: commentId,
                beat_id: beatId,
                user_id: userId,
                comment: dto.comment
            }
        })

        return this.prisma.comments.findFirst({
            where: {
                id: commentId
            },
            select: {
                comment: true,
                users: {
                    select: {
                        username: true,
                        avatar_url: true
                    }
                }
            }
        })
    }
}
