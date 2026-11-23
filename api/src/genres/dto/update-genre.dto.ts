import {
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateGenreDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}