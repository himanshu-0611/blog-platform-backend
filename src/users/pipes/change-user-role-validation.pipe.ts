import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChangeUserRoleValidationPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    const { userId, roleName, currentUserId } = value;

    console.log(userId, ' ', currentUserId);

    if (userId === currentUserId) {
      throw new BadRequestException('You cannot change your own role.');
    }

    const targetRole = await this.prisma.roles.findFirst({
      where: { role_name: roleName },
    });
    if (!targetRole) {
      throw new NotFoundException(`Role "${roleName}" not found.`);``
    }

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    if (!user) {
      throw new NotFoundException(`User with given id not found.`);
    }

    if (user.role?.role_name === roleName) {
      throw new BadRequestException(`User is already a ${roleName}.`);
    }

    return { userId, roleName, targetRole };
  }
}
