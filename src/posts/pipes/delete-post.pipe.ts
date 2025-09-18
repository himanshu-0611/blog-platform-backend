import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeleteOwnPostValidationPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const postId = value;

    const post = await this.prisma.posts.findUnique({ where: { id: postId } });

    if (!post || post.is_deleted) {
      throw new NotFoundException(`Requested post does not exist`);
    }

    return post;
  }
}
