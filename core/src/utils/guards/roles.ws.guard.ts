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
import { ROLES_KEY } from '../../utils/constants';

@Injectable()
export class RolesWsGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

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

      const req = context.switchToWs().getClient();
      // const cookies = req.handshake.auth.token.split('; ');
      const token = req.handshake.auth.token;
      if (!token) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }
      const user = this.jwtService.verify(token);
      req.user = user;
      return user.roles.some((role) => requiredRoles.includes(role.value));
    } catch (e) {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }
  }
}
