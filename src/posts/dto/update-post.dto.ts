import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MaxLength(255, { message: 'Title cannot exceed 255 characters' })
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Content cannot be empty' })
  content?: string;
}
