// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Create a new user
  async create(name: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    return this.prisma.users.create({
      data: {
        name,
        email,
        password: hashed,
        is_active: true,      // active by default
        is_archive: false,    // not archived
        created_on: new Date()
      },
    });
  }

  // Find active user by email
  async findByEmail(email: string) {
    return this.prisma.users.findFirst({
      where: { email, is_active: true, is_archive: false },
    });
  }
}
