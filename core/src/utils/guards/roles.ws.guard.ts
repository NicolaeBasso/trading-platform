import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../utils/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesWsGuard implements CanActivate {
  private readonly logger = new Logger(RolesWsGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      const req = context.switchToWs().getClient();

      const cookies: string = context.getArgs()[0].handshake.headers.cookie;
      const token = cookies.substring(
        cookies.indexOf('token=') + 6,
        cookies.indexOf(';'),
      );

      if (!token) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }

      const user = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      req.user = user;

      if (!requiredRoles) {
        return true;
      }

      return user.roles.some((role) => requiredRoles.includes(role.value));
    } catch (error) {
      this.logger.error(error);

      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
