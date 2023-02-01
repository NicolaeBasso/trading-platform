import { Injectable } from '@nestjs/common';
import { DBAdapterService } from 'src/db-adapter/db-adapter.service';
import { Model } from 'mongoose';
import { User } from 'src/db-adapter/entities/mongodb/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly dbAdapter: DBAdapterService){}

  private readonly mongodb: Model<User> & any = this.dbAdapter.db('mongodb');

  getAllUserSettings = () => this.mongodb.find().exec();

  createUserData = (data) => this.mongodb.create(data);

  removeAllUserData = () => this.mongodb.deleteMany();
}
