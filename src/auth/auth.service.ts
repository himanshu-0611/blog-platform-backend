import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseDto } from '../common/dto/response.dto/response.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(validatedData: any) {
    const { name, email, password, roleId } = validatedData;

    const user = await this.usersService.create({
      name,
      email,
      password,
      roleId,
    });

    return new ResponseDto(
      'success',
      { userId: user.id },
      'User Registered Successfully',
    );
  }

  async login(loginUserDto: LoginUserDto & { user: any }) {
    const { user } = loginUserDto;

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return new ResponseDto(
      'success',
      { access_token: token, userId: user.id },
      'User Login Successful',
    );
  }
}
