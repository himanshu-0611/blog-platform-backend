import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { LoginValidationPipe } from './pipes/login-validation.pipe';
import { SignupValidationPipe } from './pipes/signup-validation.pipe';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(SignupValidationPipe)
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @UsePipes(LoginValidationPipe)
  async login(@Body() loginUserDto: LoginUserDto & { user: any }) {
    return this.authService.login(loginUserDto);
  }
}
