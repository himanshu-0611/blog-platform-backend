import {
  Injectable,
  PipeTransform,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SignupValidationPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(value: CreateUserDto) {
    const { name, email, password } = value;

    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    const activeUser = await this.prisma.users.findFirst({
      where: { email, is_active: true, is_archive: false },
    });

    if (activeUser) {
      throw new BadRequestException(
        'User with this email already exists and is active.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const memberRole = await this.prisma.roles.findFirst({
      where: { role_name: 'Member' },
    });

    if (!memberRole) {
      throw new NotFoundException(
        'Default role "Member" not found. Please seed roles first.',
      );
    }

    return {
      name,
      email,
      password: hashedPassword,
      roleId: memberRole.id,
    };
  }
}
