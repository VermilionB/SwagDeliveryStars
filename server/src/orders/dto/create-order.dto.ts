import {IsOptional, IsString} from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsOptional()
    readonly seller: string;

    @IsString()
    @IsOptional()
    readonly consumer: string;

    @IsString()
    @IsOptional()
    readonly license: string;

    @IsString()
    @IsOptional()
    readonly beat: string;
}
