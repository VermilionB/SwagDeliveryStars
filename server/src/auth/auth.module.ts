import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";
import {PrismaService} from "../prisma.service";
import {AvatarGeneratorService} from "../avatar_generator/avatar_generator.service";
import {FileUploadService} from "../file-upload/file-upload.service";
import {ConfigService} from '@nestjs/config/dist/config.service';
import {getJwtConfig} from "../config/jwt.config";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./jwt.strategy";
import {ConfigModule} from "@nestjs/config";

@Module({
    controllers: [AuthController],
    providers: [AuthService, UsersService, PrismaService, AvatarGeneratorService, FileUploadService, JwtStrategy, ConfigService],
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJwtConfig
        }),
        ConfigModule
    ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {
}
