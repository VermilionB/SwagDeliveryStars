import {Body, Controller, Get, Post, UploadedFile, UseInterceptors, Req} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UpdateUserDto} from "../users/dto/update-user.dto";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('/login')
    login(@Body() userDto: UpdateUserDto) {
        return this.authService.login(userDto)
    }

    @Post('/registration')
    @UseInterceptors(FileInterceptor('file'))
    registration(@Body() userDto: UpdateUserDto, @UploadedFile() file?: Express.Multer.File) {
        return this.authService.registration(userDto, file)
    }

    @Get('/check')
    check(@Req() req: Request) {
        return this.authService.check(req)
    }
}