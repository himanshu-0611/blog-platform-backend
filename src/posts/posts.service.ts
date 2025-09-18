import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async addPost(userId: string, addPostDto: any) {
    return this.prisma.posts.create({
      data: {
        ...addPostDto,
        user_id: userId,
        is_deleted: false,
        created_on: new Date(),
        created_by: userId,
      },
    });
  }

  async getAllPosts() {
    return this.prisma.posts.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        title: true,
        content: true,
        created_on: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: { select: { role_name: true } },
          },
        },
      },
      orderBy: { created_on: 'desc' },
    });
  }

  async deletePost(postId: string, user: any) {
    return this.prisma.posts.update({
      where: { id: postId },
      data: { is_deleted: true, updated_by: user.id },
    });
  }

  async getPaginatedPosts(dto: {
    page_size: number;
    page_number: number;
    search_by_title?: string;
    search_by_content?: string;
  }) {
    const skip = (dto.page_number - 1) * dto.page_size;
    const take = dto.page_size;

    const where: any = { is_deleted: false };

    if (dto.search_by_title || dto.search_by_content) {
      where.OR = [];

      if (dto.search_by_title) {
        where.OR.push({
          title: { contains: dto.search_by_title, mode: 'insensitive' },
        });
      }
      if (dto.search_by_content) {
        where.OR.push({
          content: { contains: dto.search_by_content, mode: 'insensitive' },
        });
      }
    }

    const total = await this.prisma.posts.count({ where });

    const data = await this.prisma.posts.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        created_on: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: { select: { role_name: true } },
          },
        },
      },
      orderBy: { created_on: 'desc' },
      skip,
      take,
    });

    const totalPages = Math.ceil(total / dto.page_size);
    const message =
      total === 0 ? 'No Posts Available' : `Posts fetched successfully`;

    return { data, total, totalPages, message };
  }
  async updatePost(postId: string, user: any, updatePostDto: any) {
    const post = await this.prisma.posts.findUnique({ where: { id: postId } });

    if (!post || post.is_deleted) {
      throw new NotFoundException(`Post which is to be edited does not exist`);
    }

    if (post.user_id !== user.id) {
      throw new Error('You are not allowed to edit this post');
    }

    return this.prisma.posts.update({
      where: { id: postId },
      data: {
        ...updatePostDto,
        updated_by: user.id,
      },
    });
  }
}
