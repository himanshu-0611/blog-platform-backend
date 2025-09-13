// src/auth/pipes/login-validation.pipe.ts
import { Injectable, PipeTransform, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../../users/dto/login-user.dto';

@Injectable()
export class LoginValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: LoginUserDto) {
    const { email, password } = value;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist with given email');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Attach user so controller/service can use it
    return { ...value, user };
  }
}
