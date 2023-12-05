import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import {AvatarGeneratorService} from "../avatar_generator/avatar_generator.service";

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService, AvatarGeneratorService],
  exports: [FileUploadService]
})
export class FileUploadModule {}
