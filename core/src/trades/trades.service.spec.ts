import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DBAdapterModule } from '../db-adapter/adapter.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { TradeService } from './trades.service';
import { Trade } from './entities/trade.entity';

describe('TradeService', () => {
  let service: TradeService;
  let item;

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
        DBAdapterModule,
      ],
      providers: [TradeService],
    }).compile();

    service = module.get<TradeService>(TradeService);
    item = await service.create({
      pair: 'XTC/USD',
      tradeSize: 33,
      isOpen: true,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return an array', async () => {
    expect(Array.isArray(await service.findAll())).toBe(true);
  });

  it('create should return an item created', async () => {
    const item = await service.create({
      pair: 'XTC/USD',
      tradeSize: 33,
      isOpen: true,
    });

    expect(item.tradeSize).toBe(33);
  });

  it('update should update an existing item', async () => {
    const itemUpdated = await service.update(item.id, {
      id: item.id,
      tradeSize: 335,
    });

    expect(itemUpdated.tradeSize).toBe(335);
  });

  it('close should close an existing trade item', async () => {
    const itemUpdated = await service.close(item.id);

    expect(itemUpdated.isOpen).toBe(false);
  });

  it('removeAll should return an array', async () => {
    expect((await service.removeAll()).count).toBeGreaterThan(0);
  });
});
