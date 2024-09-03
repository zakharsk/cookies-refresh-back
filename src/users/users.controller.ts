import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';

import { CurrentUser } from '@/passport/decorators';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async me(@Param('id') id: string, @CurrentUser() user: User) {
    if (user.id !== id) throw new ForbiddenException();
    return this.usersService.findOne(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteMyUser(@Param('id') id: string, @CurrentUser() user: User) {
    if (user.id !== id) throw new ForbiddenException();
    await this.usersService.remove(id);
  }
}
