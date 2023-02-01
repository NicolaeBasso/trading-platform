import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DBAdapterModule } from '../db-adapter/adapter.module';

@Module({
  imports: [JwtModule, PassportModule, DBAdapterModule],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
