import { IsUUID, IsOptional, IsEmail, MinLength, IsString, IsInt, IsBoolean, IsArray } from 'class-validator';

export class CreateUserDto {
    @IsOptional()
    @IsUUID()
    id: string;

    @IsEmail()
    @MinLength(1, {
        message: 'Email is required',
    })
    email: string;

    @IsString()
    @MinLength(1, {
        message: 'Password is required',
    })
    password: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    avatar_url: string;

    @IsBoolean()
    @IsOptional()
    is_banned: boolean;

    @IsInt()
    @IsOptional()
    role_id: number;
}
