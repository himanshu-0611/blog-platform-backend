import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DeletePostPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    const post = await this.prisma.posts.findUnique({
      where: { id: value },
    });

    if (!post || post.is_deleted) {
      throw new NotFoundException(`Post with id ${value} does not exist`);
    }

    return value;
  }
}
