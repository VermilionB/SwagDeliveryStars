import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {PrismaService} from "../prisma.service";
import {AvatarGeneratorService} from "../avatar_generator/avatar_generator.service";
import {FileUploadService} from "../file-upload/file-upload.service";
import {FileUploadModule} from "../file-upload/file-upload.module";
import {JwtService} from "@nestjs/jwt";

@Module({
  providers: [UsersService, PrismaService, FileUploadService, AvatarGeneratorService, JwtService],
  controllers: [UsersController],
  imports: [FileUploadModule]

})
export class UsersModule {}
