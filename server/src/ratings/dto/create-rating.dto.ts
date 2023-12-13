import { IsString, IsOptional, IsNumber} from 'class-validator';

export class CreateRatingDto {
    @IsNumber()
    @IsOptional()
    rating: number;
}
