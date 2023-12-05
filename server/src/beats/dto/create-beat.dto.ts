import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class CreateBeatDto {
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly genreId: string;

    @IsString()
    @IsOptional()
    readonly imageUrl: string;

    @IsString()
    @IsOptional()
    readonly description: string;

    @IsString()
    @IsOptional()
    readonly key: string;

    @IsString()
    @IsOptional()
    readonly bpm: string;

    @IsArray()
    @IsOptional()
    readonly tags: string[];

    @IsString()
    @IsOptional()
    readonly isFree: string;

    @IsOptional()
    readonly licenses: string

}
