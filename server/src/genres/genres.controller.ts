import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {GenresService} from "./genres.service";
import {AuthGuard} from "@nestjs/passport";
import {Roles, RolesGuard} from "../auth/decorators/auth.decorator";
import {Role} from "../auth/enum/roles.enum";

@Controller('genres')
export class GenresController {
    constructor(private readonly genresService: GenresService) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Post()
    async createGenre(@Body() genre: { genre?: string }) {
        return this.genresService.createGenre(genre);
    }
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Put(':id')
    async updateGenre(@Param('id') id: string, @Body() genre: { genre?: string }) {
        return this.genresService.updateGenre(id, genre);
    }
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    async deleteGenre(@Param('id') id: string) {
        return this.genresService.deleteGenre(id);
    }

    @Get(':id')
    async getGenreById(@Param('id') id: string) {
        return this.genresService.getGenreById(id);
    }

    @Get()
    async getAllGenres() {
        return this.genresService.getAllGenres();
    }
}
