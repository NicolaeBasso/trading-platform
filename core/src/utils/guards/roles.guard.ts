import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ROLES_KEY } from 'src/utils/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;

      const bearer = authHeader?.split(' ')[0];
      // const token = authHeader?.split(' ')[1];
      const token = req.cookies?.token;


      if (!token) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }

      let user = null;
      try {
        user = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
      } catch (error) {
        console.error(error);
      }
      req.user = user;

      // return user.role.some((role) => requiredRoles.includes(role.value));
      return user.role === requiredRoles[0];
    } catch (e) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
