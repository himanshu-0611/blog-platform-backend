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
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDto } from '../common/dto/response.dto/response.dto';
import { DeleteUserValidationPipe } from './pipes/delete-user-validation.pipe';
import { ChangeUserRoleValidationPipe } from './pipes/change-user-role-validation.pipe';
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
    await this.usersService.deleteUser(id);
    return new ResponseDto(
      'success',
      {},
      `User ${id} deleted successfully by ${user.email}`,
    );
  }
  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scope('users:CHANGE_ROLE:change_role')
  @Post('change-role')
  @UsePipes(ChangeUserRoleValidationPipe)
  async changeUserRole(
    @Body() validatedData: any,
    @CurrentUser() currentUser: any,
  ) {
    const { userId, roleName, targetRole } = validatedData;

    const updatedUser = await this.usersService.changeUserRole(
      userId,
      roleName,
      currentUser.id,
    );

    return new ResponseDto(
      'success',
      updatedUser,
      `User role changed to ${targetRole.role_name}.`,
    );
  }
  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scope('users:GET:get_all_users')
  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();

    return new ResponseDto(
      'success',
      users,
      `Fetched ${users.length} users successfully.`,
    );
  }
}
