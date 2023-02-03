import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaModule } from '../../prisma/prisma.module';
import { DBAdapterService } from './db-adapter.service';
import { User, UserSchema } from './entities/mongodb/user.entity';

console.log('URI = ', process.env.MONGODB_URI);

@Module({
  imports: [
    PrismaModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [DBAdapterService],
  exports: [DBAdapterService],
})
export class DBAdapterModule {}
