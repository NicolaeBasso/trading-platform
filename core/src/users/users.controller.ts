import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UsersService } from './users.service';
import { Roles } from '../utils/constants';
import { RolesDecorator } from '../utils/decorators/roles.decorator';
import { RolesGuard } from '../utils/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyUser(@Req() req) {
    // console.log(req.cookies);
    // console.log(req.user);

    return this.usersService.getMyUser(req);
  }

  @Get()
  @RolesDecorator(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getUsers() {
    return this.usersService.getUsers();
  }
}
