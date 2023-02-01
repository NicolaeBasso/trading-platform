import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DBAdapterModule } from 'src/db-adapter/adapter.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DBAdapterModule, JwtModule, PassportModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
