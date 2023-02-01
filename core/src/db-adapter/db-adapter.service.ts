import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from 'prisma/prisma.service';
import { User } from './entities/mongodb/user.entity';
import { DB_TYPE } from './types/db-types';

@Injectable()
export class DBAdapterService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  db = (dbType: DB_TYPE) => {
    switch (dbType) {
      case 'corePostgres':
        return this.prisma;
      case 'mongodb':
        return this.userModel;
    }
  };
}
