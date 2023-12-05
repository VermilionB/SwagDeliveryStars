import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import { v4 as uuidv7 } from 'uuid';

@Injectable()
export class GenresService {
    constructor(private readonly prisma: PrismaService) {}

    async createGenre(genre: { genre?: string }) {
        return this.prisma.genres.create({
            data: {
                id: uuidv7(),
                ...genre,
            },
        });
    }

    async updateGenre(id: string, genre: { genre?: string }) {
        const existingGenre = await this.prisma.genres.findUnique({ where: { id } });

        if (!existingGenre) {
            throw new NotFoundException(`Genre with id ${id} not found`);
        }

        return this.prisma.genres.update({
            where: { id },
            data: { ...genre },
        });
    }

    async deleteGenre(id: string) {
        const existingGenre = await this.prisma.genres.findUnique({ where: { id } });

        if (!existingGenre) {
            throw new NotFoundException(`Genre with id ${id} not found`);
        }

        return this.prisma.genres.delete({
            where: { id },
        });
    }

    async getGenreById(id: string) {
        return this.prisma.genres.findUnique({
            where: { id },
            include: {
                beats: true,
            },
        });
    }

    async getAllGenres() {
        return this.prisma.genres.findMany();
    }
}
