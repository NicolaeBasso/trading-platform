import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DBAdapterModule } from '../db-adapter/adapter.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';

describe('TradeController', () => {
  let controller: TradeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, DBAdapterModule, JwtModule, PassportModule, ConfigModule.forRoot({
        envFilePath: '.env',
        isGlobal: true,
      }),],
      controllers: [TradeController],
      providers: [TradeService],
    }).compile();

    controller = module.get<TradeController>(TradeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
