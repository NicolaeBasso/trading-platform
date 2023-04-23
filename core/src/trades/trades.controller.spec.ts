import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../../prisma/prisma.module';
import { TradesController } from './trades.controller';
import { TradeService } from './trades.service';

describe('TradesController', () => {
  let controller: TradesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        JwtModule,
        PassportModule,
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
      ],
      controllers: [TradesController],
      providers: [TradeService],
    }).compile();

    controller = module.get<TradesController>(TradesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
