import { Body, Controller, Get, Post, Delete, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, Role } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    const {email, password} = dto;
    return this.authService.register({email, password, role: Role.USER});
  }

  @Post('registerAdmin')
  registerAdmin(@Body() dto: AuthDto) {
    return this.authService.register({...dto, role: Role.ADMIN});
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

  @Delete('removeAll')
  removeAllUsers(@Response() res) {
    console.log('Logout!');
    return this.authService.removeAllUsers(res);
  }
}
