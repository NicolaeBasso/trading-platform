import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AccountGateway } from './account.gateway';
import { CapitalComModule } from '../capital-com/cc.module';

@Module({
  imports: [JwtModule, CapitalComModule],
  controllers: [UsersController],
  providers: [UsersService, AccountGateway, JwtStrategy],
  exports: [UsersService, AccountGateway],
})
export class UsersModule {}
