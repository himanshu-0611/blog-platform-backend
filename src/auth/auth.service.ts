// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResponseDto } from '../common/dto/response.dto/response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
  const { name, email, password } = createUserDto;
  const user = await this.usersService.create(name, email, password);
  return new ResponseDto(
    'success',
    { userId: user.id },
    'User Registered Successfully',
  );
}

  async login(loginUserDto: LoginUserDto) {
    const {name, email, password } = loginUserDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist with given email');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid Credentials');
      
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return new ResponseDto(
      'success',
      { access_token: token },
      'User Login Successful',
    );
  }
}
