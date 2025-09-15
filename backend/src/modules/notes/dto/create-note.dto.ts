import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  tags?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
