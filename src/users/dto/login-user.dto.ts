import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
