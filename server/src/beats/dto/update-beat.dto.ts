import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateBeatDto {
    @IsString()
    @IsOptional()
    readonly beatId: string

    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly imageUrl: string;

    @IsString()
    @IsOptional()
    readonly description: string;

    @IsString()
    @IsOptional()
    readonly isFree: string;

    @IsOptional()
    readonly licenses: string

}
