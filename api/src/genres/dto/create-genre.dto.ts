import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateGenreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}