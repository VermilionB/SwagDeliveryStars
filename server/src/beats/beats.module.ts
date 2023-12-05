import { Module } from '@nestjs/common';
import { BeatsController } from './beats.controller';
import { BeatsService } from './beats.service';
import {PrismaService} from "../prisma.service";
import {FileUploadService} from "../file-upload/file-upload.service";
import {AvatarGeneratorService} from "../avatar_generator/avatar_generator.service";

@Module({
  controllers: [BeatsController],
  providers: [BeatsService, PrismaService, FileUploadService, AvatarGeneratorService]
})
export class BeatsModule {}
