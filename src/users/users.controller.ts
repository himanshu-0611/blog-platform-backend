import {
  Controller,
  Delete,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDto } from '../common/dto/response.dto/response.dto';
import { DeleteUserValidationPipe } from './pipes/delete-user-validation.pipe';
import { Scope } from '../common/decorators/scope.decorator';
import { ScopesGuard } from '../common/guards/scopes.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scope('users:DELETE:delete_user')
  @Delete(':id')
  @UsePipes(DeleteUserValidationPipe)
  async deleteUser(@Param('id') id: string, @CurrentUser() user: any) {
    await this.usersService.delete(id);
    return new ResponseDto(
      'success',
      {},
      `User ${id} deleted successfully by ${user.email}`,
    );
  }
}
