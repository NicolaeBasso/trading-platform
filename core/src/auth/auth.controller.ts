import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Request,
  Response,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, Role } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthService.name);

  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    const { email, password } = dto;
    return this.authService.register({ email, password });
  }

  @Post('login')
  async login(@Request() req, @Body() dto: LoginDto) {
    this.logger.debug(`Login! ${dto.email} ${dto.password}`);

    return this.authService.login(dto, req);
  }

  @Get('logout')
  logout(@Request() req) {
    this.logger.debug(`Logout!`);

    return this.authService.logout(req);
  }

  @Delete('removeAll')
  removeAllUsers(@Response() res) {
    this.logger.warn(`All users deleted.`);

    return this.authService.removeAllUsers(res);
  }
}
