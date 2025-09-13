import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class CreateUserValidator implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(email: string, args: ValidationArguments) {
    const user = await this.prisma.users.findFirst({
      where: { email, is_active: true, is_archive: false },
    });
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email already exists for an active user';
  }
}
