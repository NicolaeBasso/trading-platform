import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';

@Module({
  imports: [JwtModule, PassportModule],
  controllers: [TradeController],
  providers: [
    TradeService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class TradeModule {}
