import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  tags?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
