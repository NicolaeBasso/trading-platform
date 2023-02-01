import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/utils/constants';
import { RolesDecorator } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService){}

  @Get('config/all')
  getUserData(): Promise<any> {
    return this.userService.getAllUserSettings();
  }

  @Post('config')
  createUserData(
    @Body()
    createUserDataDto,
  ) {
    return this.userService.createUserData(createUserDataDto);
  }

  @Delete('/removeAll')
  @RolesDecorator(Roles.ADMIN)
  @UseGuards(RolesGuard)
  removeAll() {
    return this.userService.removeAllUserData();
  }
}
