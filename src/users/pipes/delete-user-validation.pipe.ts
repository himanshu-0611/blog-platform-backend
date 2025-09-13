import { ArgumentMetadata, Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DeleteUserValidationPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') return value;

    const user = await this.prisma.users.findUnique({
      where: { id: value },
    });

    if (!user || !user.is_active || user.is_archive) {
      throw new NotFoundException(`Active user with id ${value} does not exist`);
    }

    return value;
  }
}
