import { Body, Controller, Get, Post, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Request() req, @Response() res, @Body() dto: AuthDto) {
    return this.authService.login(dto, req, res);
  }

  @Get('logout')
  logout(@Request() req, @Response() res) {
    console.log('Logout!');
    return this.authService.logout(req, res);
  }
}
