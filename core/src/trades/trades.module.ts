import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TradesController } from './trades.controller';
import { TradeService } from './trades.service';
import { CapitalComModule } from '../capital-com/cc.module';

@Module({
  imports: [JwtModule, PassportModule, CapitalComModule],
  controllers: [TradesController],
  providers: [
    TradeService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class TradeModule {}
