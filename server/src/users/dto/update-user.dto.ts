import { IsUUID, IsOptional, IsEmail, MinLength, IsString, IsInt, IsBoolean, IsArray } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsUUID()
    id: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    avatar_url: string;

    @IsString()
    @IsOptional()
    bio: string;

    @IsString()
    @IsOptional()
    contact_info: string;

    @IsString()
    @IsOptional()
    youtube: string;

    @IsString()
    @IsOptional()
    facebook: string;

    @IsString()
    @IsOptional()
    soundcloud: string;

    @IsString()
    @IsOptional()
    twitter: string;

    @IsString()
    @IsOptional()
    instagram: string;

    @IsString()
    @IsOptional()
    tiktok: string;

    @IsString()
    @IsOptional()
    twitch: string;

    @IsBoolean()
    @IsOptional()
    is_banned: boolean;

    @IsInt()
    @IsOptional()
    role_id: number;
}
