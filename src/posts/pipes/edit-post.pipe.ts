import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EditPostValidationPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(postId: string) {
    const post = await this.prisma.posts.findUnique({ where: { id: postId } });

    if (!post || post.is_deleted) {
      throw new NotFoundException(`Post which is to be edited does not exist`);
    }

    return postId;
  }
}
