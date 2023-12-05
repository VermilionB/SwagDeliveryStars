import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { BeatsModule } from './beats/beats.module';
import { GenresService } from './genres/genres.service';
import { GenresModule } from './genres/genres.module';
import { AvatarGeneratorService } from './avatar_generator/avatar_generator.service';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { KeysModule } from './keys/keys.module';
import { LicensesModule } from './licenses/licenses.module';
import { OrdersModule } from './orders/orders.module';
@Module({
  controllers: [],
  providers: [PrismaService, GenresService, AvatarGeneratorService],
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    BeatsModule,
    GenresModule,
    AuthModule,
    FileUploadModule,
    KeysModule,
    LicensesModule,
    OrdersModule,
  ]
})
export class AppModule {}
