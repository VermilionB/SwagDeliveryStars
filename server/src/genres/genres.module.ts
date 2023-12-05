import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import {PrismaService} from "../prisma.service";
import {GenresService} from "./genres.service";

@Module({
  controllers: [GenresController],
  providers: [GenresService, PrismaService]

})
export class GenresModule {}
