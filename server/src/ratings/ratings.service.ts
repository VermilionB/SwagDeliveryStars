import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {CreateRatingDto} from "./dto/create-rating.dto";

@Injectable()
export class RatingsService {
    constructor(private readonly prisma: PrismaService) {}

    async createRating(dto: CreateRatingDto, beatId: string, userId: string){
        const existingRating = await this.prisma.ratings.findFirst({
            where: {
                beat_id: beatId,
                user_id: userId
            }
        })

        if(!existingRating){
            return this.prisma.ratings.create({
                data: {
                    beat_id: beatId,
                    user_id: userId,
                    rating: dto.rating
                }
            })
        }
        else {
            return this.prisma.ratings.update({
                where: {
                    user_id_beat_id: {
                        beat_id: beatId,
                        user_id: userId
                    }
                },
                data: {
                    rating: dto.rating
                }
            })
        }
    }

    async getRatingByUserAndBeat(beatId: string, userId: string) {
        return this.prisma.ratings.findFirst({
            where: {
                beat_id: beatId,
                user_id: userId
            },
            select: {
                rating: true
            }
        })
    }
}
