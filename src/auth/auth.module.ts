// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'supersecretkey', // move to .env later
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
