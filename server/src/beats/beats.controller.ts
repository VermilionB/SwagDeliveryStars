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
    @Get(':id')
    async getBeatById(@Param('id') id: string) {
        return this.beatsService.getBeatById(id);
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

    // @Get('plays/:listenerId')
    // async getPlaysByUser(@Param('listenerId') listenerId: string) {
    //     return this.beatsService.getPlaysByBeat(listenerId)
    // }

    // @Get('plays')
    // async getPlaysByBeat(@Query('beatId') beatId: string) {
    //     return this.beatsService.getPlaysByBeat(beatId)
    // }

    //
    // @Put(':id')
    // async updateBeat(@Param('id') id: string, @Body() dto: BeatsDto) {
    //     return this.beatsService.updateBeat(id, dto);
    // }
    //
    // @Delete(':id')
    // async deleteBeat(@Param('id') id: string) {
    //     return this.beatsService.deleteBeat(id);
    // }
    //
}
