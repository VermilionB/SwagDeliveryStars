import { Module } from '@nestjs/common';
import { LicensesService } from './licenses.service';
import { LicensesController } from './licenses.controller';
import {PrismaService} from "../prisma.service";

@Module({
  controllers: [LicensesController],
  providers: [LicensesService, PrismaService],
})
export class LicensesModule {}
