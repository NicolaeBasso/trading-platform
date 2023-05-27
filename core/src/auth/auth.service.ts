import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { ENV_TYPE, jwtSecret } from '../utils/constants';
import { AuthDto, Role } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: AuthDto) {
    const { email, password } = dto;

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    await this.prisma.user.create({
      data: {
        email,
        hashedPassword,
        role: Role.USER,
      },
    });

    return { message: 'User created succefully', status: HttpStatus.CREATED };
  }

  async login(dto: LoginDto, req: Request): Promise<any> {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('Wrong credentials');
    }

    const compareSuccess = await this.comparePasswords({
      password,
      hash: foundUser.hashedPassword,
    });

    if (!compareSuccess) {
      throw new BadRequestException('Wrong credentials');
    }

    const token = await this.signToken({
      userId: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    });

    if (!token) {
      throw new ForbiddenException('Could not login');
    }

    return req.res
      .cookie('token', token, {
        httpOnly: true,
        sameSite:
          this.configService.get<string>('ENV') === ENV_TYPE.LOCAL
            ? 'lax'
            : 'none',
        secure:
          this.configService.get<string>('ENV') === ENV_TYPE.LOCAL
            ? false
            : true,
      })
      .req.res.cookie('jwt', token)
      .send({
        message: 'Logged in succefully',
        status: HttpStatus.OK,
      });
  }

  async removeAllUsers(res: Response) {
    await this.prisma.user.deleteMany({});

    return res.send({ message: 'All users deleted' });
  }

  async logout(req: Request) {
    req.res.clearCookie('token');
    req.res.clearCookie('jwt');

    return req.res.send({ message: 'Logged out succefully' });
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;

    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(args: { hash: string; password: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { userId: string; email: string; role: string }) {
    const payload = {
      id: args.userId,
      email: args.email,
      role: args.role,
    };

    const token = await this.jwt.signAsync(payload, {
      secret: jwtSecret,
    });

    return token;
  }
}
