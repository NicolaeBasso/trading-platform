import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AccountGateway } from './account.gateway';

@Module({
  imports: [JwtModule],
  controllers: [UsersController],
  providers: [UsersService, AccountGateway, JwtStrategy],
  exports: [UsersService, AccountGateway],
})
export class UsersModule {}
