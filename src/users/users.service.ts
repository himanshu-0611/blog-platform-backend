// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    return this.prisma.users.create({
      data: {
        name,
        email,
        password: hashed,
        is_active: true,
        is_archive: false,
        created_on: new Date()
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.users.findFirst({
      where: { email, is_active: true, is_archive: false },
    });
  }

  async delete(id: string) {
    const deletedUser = await this.prisma.users.update({
      where: { id },
      data: { is_active: false, is_archive: true },
    });
    return deletedUser;
  }
}
