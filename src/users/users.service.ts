import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({
    name,
    email,
    password,
    roleId,
  }: {
    name: string;
    email: string;
    password: string;
    roleId: string;
  }) {
    const existingUser = await this.prisma.users.findFirst({
      where: { email, is_active: false, is_archive: true },
    });

    if (existingUser) {
      return this.prisma.users.update({
        where: { id: existingUser.id },
        data: {
          name,
          password,
          is_active: true,
          is_archive: false,
          updated_on: new Date(),
        },
      });
    }

    return this.prisma.users.create({
      data: {
        name,
        email,
        password,
        role_id: roleId,
        is_active: true,
        is_archive: false,
        created_on: new Date(),
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.users.findFirst({
      where: { email, is_active: true, is_archive: false },
    });
  }

  async deleteUser(id: string) {
    const deletedUser = await this.prisma.users.update({
      where: { id },
      data: { is_active: false, is_archive: true },
    });
    return deletedUser;
  }

  async changeUserRole(userId: string, roleName: string, changerId: string) {
    const targetRole = await this.prisma.roles.findFirst({
      where: { role_name: roleName },
    });

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    if (!targetRole) throw new BadRequestException(`Invalid role.`);
    if (!user) throw new NotFoundException(`User not found.`);

    return this.prisma.users.update({
      where: { id: userId },
      data: {
        role_id: targetRole.id,
        updated_on: new Date(),
        updated_by: changerId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        is_active: true,
        role: {
          select: {
            id: true,
            role_name: true,
          },
        },
      },
    });
  }
  async getAllUsers() {
    return this.prisma.users.findMany({
      where: { is_active: true, is_archive: false },
      select: {
        id: true,
        name: true,
        email: true,
        created_on: true,
        role: {
          select: {
            role_name: true,
          },
        },
      },
      orderBy: { created_on: 'desc' },
    });
  }
}
