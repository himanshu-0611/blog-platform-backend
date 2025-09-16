import { IsNotEmpty, IsString } from 'class-validator';

export class AddPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
