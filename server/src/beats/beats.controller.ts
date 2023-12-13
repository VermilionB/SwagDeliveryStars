import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put, Query,
    UploadedFile, UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {BeatsService} from "./beats.service";
import {AuthGuard} from "@nestjs/passport";
import {Roles, RolesGuard} from "../auth/decorators/auth.decorator";
import {Role} from "../auth/enum/roles.enum";
import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import {CurrentUser} from "../auth/decorators/user.decorator";
import {CreateBeatDto} from "./dto/create-beat.dto";
import {FileSizeInterceptor} from "../file-upload/interceptors/file-size.interceptor";
import {UpdateBeatDto} from "./dto/update-beat.dto";

@Controller('beats')
export class BeatsController {
    constructor(private readonly beatsService: BeatsService) {
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @UseInterceptors(FileFieldsInterceptor([
            {name: 'mp3_file', maxCount: 1},
            {name: 'wav_file', maxCount: 1},
            {name: 'zip_file', maxCount: 1},
            {name: 'image_file', maxCount: 1}
        ]),
        FileSizeInterceptor)
    @Post()
    async createBeat(@Body() dto: CreateBeatDto,
                     @CurrentUser('id') producerId: string,
                     @UploadedFiles() files: {
                         mp3_file: Express.Multer.File[],
                         wav_file: Express.Multer.File[],
                         zip_file: Express.Multer.File[],
                         image_file: Express.Multer.File[]
                     }) {
        return this.beatsService.create(dto, producerId, files);
    }

    @Get('length')
    async getAllBeatsCount() {
        return this.beatsService.getAllBeatsCount();
    }


    @Get()
    async getAllBeats(@Query('page') page: number, @Query('pageSize') pageSize: number) {
        return this.beatsService.getAllBeats(+page, +pageSize);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Post('play/:beatId')
    async playBeat(@CurrentUser('id') listenerId: string, @Param('beatId') beatId: string) {
        return this.beatsService.playBeat(listenerId, beatId)
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Post('like/:beatId')
    async likeBeat(@CurrentUser('id') userId: string, @Param('beatId') beatId: string) {
        return await this.beatsService.likeBeat(userId, beatId);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Post('dislike/:beatId')
    async dislikeBeat(@CurrentUser('id') userId: string, @Param('beatId') beatId: string) {
        return await this.beatsService.unlikeBeat(userId, beatId);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Get('findLiked/:beatId')
    async findLiked(@CurrentUser('id') userId: string, @Param('beatId') beatId: string) {
        return await this.beatsService.findLiked(userId, beatId);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Post('repost/:beatId')
    async repostBeat(@CurrentUser('id') userId: string, @Param('beatId') beatId: string) {
        return await this.beatsService.repostBeat(userId, beatId);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Post('unrepost/:beatId')
    async unrepostBeat(@CurrentUser('id') userId: string, @Param('beatId') beatId: string) {
        return await this.beatsService.unrepostBeat(userId, beatId);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Get('findReposted/:beatId')
    async findReposted(@CurrentUser('id') userId: string, @Param('beatId') beatId: string) {
        return await this.beatsService.findReposted(userId, beatId);
    }

    @Get(':id')
    async getBeatById(@Param('id') id: string) {
        return this.beatsService.getBeatById(id);
    }
    
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @UseInterceptors(FileInterceptor('image_file'))
    @Put()
    async updateBeat(@Body() dto: UpdateBeatDto, @UploadedFile() file: Express.Multer.File, @CurrentUser('id') userId: string) {
        return this.beatsService.updateBeat(dto, file, userId);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Delete(':beatId')
    async deleteBeat(@Param('beatId') beatId: string, @CurrentUser('id') userId: string) {
        return this.beatsService.deleteBeat(beatId, userId);
    }
}
