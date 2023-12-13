import {
    Body,
    Controller,
    Delete,
    Get,
    Param, Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {UpdateUserDto} from "./dto/update-user.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {CurrentUser} from "../auth/decorators/user.decorator";
import {Roles, RolesGuard} from "../auth/decorators/auth.decorator";
import {Role} from "../auth/enum/roles.enum";
import {AuthGuard} from "@nestjs/passport";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Get()
    async getAllUsers() {
        return this.usersService.getAll();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Put()
    @UseInterceptors(FileInterceptor('file'))
    async updateUser(@Body() dto: UpdateUserDto, @CurrentUser('id') id: string, @UploadedFile() file?: Express.Multer.File) {
        return await this.usersService.updateUser(id, dto, file);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return await this.usersService.deleteUser(id)
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Post('/follow/:id')
    async followUser(@Param('id') id: string, @CurrentUser('id') currentUserId: string) {
        console.log(`id --------- ${id}`)
        return await this.usersService.followUser(id, currentUserId)
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Post('/unfollow/:id')
    async unfollowUser(@Param('id') id: string, @CurrentUser('id') currentUserId: string){
            return await this.usersService.unfollowUser(id, currentUserId)
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Producer)
    @Get('/findFollowed/:id')
    async findFollowed(@Param('id') id: string, @CurrentUser('id') currentUserId: string){
        // console.log(id)
        return await this.usersService.findFollowed(id, currentUserId)
    }

    @Get('/:id')
    async getUserById(@Param('id') id: string) {
        return await this.usersService.getUserById(id);
    }

}
