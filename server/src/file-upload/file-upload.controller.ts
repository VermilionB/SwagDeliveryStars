import {Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {FileUploadService} from './file-upload.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {AuthGuard} from "@nestjs/passport";
import {Roles, RolesGuard} from "../auth/decorators/auth.decorator";
import {Role} from "../auth/enum/roles.enum";

@Controller('file-upload')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) {
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Post('uploadAvatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
        return this.fileUploadService.uploadFile(file);
    }

    @Get(':fileKey')
    async getPresignedUrl(@Param('fileKey') avatarKey: string) {
        try {
            const presignedUrl = await this.fileUploadService.generatePresignedUrl(avatarKey);
            return presignedUrl
        } catch (error) {
            console.error(error);
        }
    }
}
