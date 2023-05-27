import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMyUser(req: Request) {
    const { id }: Partial<User> = req.user;
    const decodedUserInfo = req.user as { id: string; email: string };

    const foundUser = await this.prisma.user.findUnique({ where: { id } });

    if (!foundUser) {
      throw new NotFoundException();
    }

    if (foundUser.id !== decodedUserInfo.id) {
      throw new ForbiddenException();
    }

    delete foundUser.hashedPassword;

    return foundUser;
  }

  async getUsers() {
    const users = await this.prisma.user.findMany({
      // select: { id: true, email: true },
    });

    return { users };
  }
}
