import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto/response.dto';
import { ScopesGuard } from 'src/common/guards/scopes.guard';
import { AuthGuard } from '@nestjs/passport';
import { Scope } from 'src/common/decorators/scope.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PostsService } from './posts.service';
import { AddPostDto } from './dto/add-post.dto';
import { PaginatedPostsDto } from './dto/paginated-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AddPostPipe } from './pipes/add-post.pipe';
import { EditPostValidationPipe } from './pipes/edit-post.pipe';

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
  @Scope('posts:DELETE:delete_any_post')
  @Delete(':id')
  async deletePostAny(@Param('id') id: string, @CurrentUser() user: any) {
    return new ResponseDto(
      'success',
      this.postsService.deletePost(id, user),
      `Post deleted successfully`,
    );
  }

  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scope('posts:DELETE:delete_own_post')
  @Delete('own/:id')
  async deleteOwnPost(@Param('id') id: string, @CurrentUser() user: any) {
    return new ResponseDto(
      'success',
      this.postsService.deletePost(id, user),
      `Post deleted successfully`,
    );
  }

  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scope('posts:GET:get_all_posts')
  @Post('get_posts')
  async getPaginatedPosts(@Body(ValidationPipe) dto: PaginatedPostsDto) {
    const { data, total, totalPages, message } =
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
      message,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scope('posts:EDIT:edit_post')
  async updatePost(
    @Param('id', EditPostValidationPipe) id: string,
    @CurrentUser() user: any,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const updated = await this.postsService.updatePost(id, user, updatePostDto);
    return new ResponseDto('success', updated, `Post edited successfully`);
  }
}
