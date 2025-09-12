// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserValidator } from './validators/create-user.validator/create-user.validator';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, CreateUserValidator],
  exports: [UsersService],
})
export class UsersModule {}
