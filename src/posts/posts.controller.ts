import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto/response.dto';
import { ScopesGuard } from 'src/common/guards/scopes.guard';
import { AuthGuard } from '@nestjs/passport';
import { Scope } from 'src/common/decorators/scope.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PostsService } from './posts.service';
import { AddPostDto } from './dto/add-post.dto';
import { PaginatedPostsDto } from './dto/paginated-posts.dto';
import { AddPostPipe } from './pipes/add-post.pipe';
import { DeletePostPipe } from './pipes/delete-post.pipe';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scope('posts:ADD:add_post')
  @Post()
  @UsePipes(AddPostPipe)
  async addPost(@CurrentUser() user: any, @Body() addPostDto: AddPostDto) {
    const createdPost = await this.postsService.addPost(user.id, addPostDto);

    return new ResponseDto(
      'success',
      createdPost,
      `Post created successfully by user ${user.id}`,
    );
  }

  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scope('posts:DELETE:delete_any_post') // Admin can delete any post
  @Delete(':id')
  async deletePostAny(@Param('id') id: string, @CurrentUser() user: any) {
    return new ResponseDto(
      'success',
      this.postsService.deletePost(id, user),
      `Post deleted successfully`,
    );
  }

  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scope('posts:DELETE:delete_own_post') // Member can delete only their own post
  @Delete('own/:id')
  async deleteOwnPost(@Param('id') id: string, @CurrentUser() user: any) {
    return new ResponseDto(
      'success',
      this.postsService.deletePost(id, user),
      `Post deleted successfully`,
    );
  }

  @Post('paginated')
  async getPaginatedPosts(@Body() dto: PaginatedPostsDto) {
    const { data, total, totalPages } =
      await this.postsService.getPaginatedPosts(dto);

    return new ResponseDto(
      'success',
      {
        page_size: dto.page_size,
        page_number: dto.page_number,
        total_pages: totalPages,
        total_items: total,
        data,
      },
      `Fetched page ${dto.page_number} of posts successfully`,
    );
  }
}
