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
import { ConfigService } from '@nestjs/config';
import { ROLES_KEY } from 'src/utils/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

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
      this.logger.debug('requiredRoles', requiredRoles);
      if (!requiredRoles) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      const token = req.cookies?.token;

      this.logger.debug('token', token);

      if (!token) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }

      let user = null;
      try {
        user = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
      } catch (error) {
        this.logger.error('RolesGuard | Invalid JWT');
      }
      req.user = user;

      // return user.role.some((role) => requiredRoles.includes(role.value));
      return user.role === requiredRoles[0];
    } catch (e) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
