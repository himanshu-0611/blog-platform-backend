import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { CreateUserValidator } from '../validators/create-user.validator/create-user.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(CreateUserValidator)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
