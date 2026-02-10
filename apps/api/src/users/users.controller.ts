import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './common/enums/roles.enums';
import { Roles } from './common/decorators/roles.decorator';
import { RolesGuard } from './common/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() body: { username: string; pin: string; role?: Role }) {
    return this.usersService.create(body.username, body.pin, body.role);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('role/:role')
  async findByRole(@Param('role') role: Role) {
    return this.usersService.findByRole(role);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/reset-pin/:username')
  async resetPin(@Param('username') username: string) {
    return this.usersService.resetPinByUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/pin')
  async updateMyPin(@Request() req, @Body() body: { pin: string }) {
    return this.usersService.updatePin(req.user.userId, body.pin);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
