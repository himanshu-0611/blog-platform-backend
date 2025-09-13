import { Controller, Delete, Param, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDto } from '../common/dto/response.dto/response.dto';
import { DeleteUserValidationPipe } from './pipes/delete-user-validation.pipe'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @UsePipes(DeleteUserValidationPipe)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.delete(id);
    return new ResponseDto('success', null, `User ${id} deleted successfully`);
  }
}
