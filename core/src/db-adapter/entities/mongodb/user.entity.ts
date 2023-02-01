import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDataType } from 'src/db-adapter/types/user-data.type';

@Schema()
export class User {
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  userId: string;

  @Prop({ type: Object })
  data: UserDataType;
}

export const UserSchema = SchemaFactory.createForClass(User);
