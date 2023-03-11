import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { DBAdapterModule } from '../db-adapter/adapter.module';
import { RolesGuard } from '../utils/guards/roles.guard';

@Module({
  imports: [JwtModule, PassportModule, DBAdapterModule],
  controllers: [TradeController],
  providers: [TradeService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
    ],
})
export class TradeModule {}
