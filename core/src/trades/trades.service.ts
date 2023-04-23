import { Injectable } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Trade } from './entities/trade.entity';
import { CapitalComWebSocketGateway } from '../capital-com/cc.ws.gateway.service';

@Injectable()
export class TradeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly ccWsGateway: CapitalComWebSocketGateway,
  ) {}

  async create(createTradeDto: CreateTradeDto) {
    const { pair, tradeSize } = createTradeDto;

    console.log(`Subscriptions`, this.ccWsGateway.subscriptions);
    console.log(`Pairs`, this.ccWsGateway.pairs);

    const priceOpened = this.ccWsGateway.pairs[pair].bid;

    const tradeCreated = await this.prisma.trade.create({
      data: {
        pair,
        tradeSize,
        isOpen: true,
        priceOpened: priceOpened,
        overnightInterest: 0.15,
        overnightFee: 0.1,
        ...createTradeDto,
      },
    });

    return tradeCreated;
  }

  async findAll(): Promise<Trade[] & any> {
    return this.prisma.trade.findMany();
  }

  async findOne(id: string) {
    return this.prisma.trade.findFirstOrThrow({ where: { id } });
  }

  async update(id: string, updateTradeDto: UpdateTradeDto) {
    const { pair, tradeSize } = updateTradeDto;

    return this.prisma.trade.update({
      where: { id },
      data: { pair, tradeSize },
    });
  }

  async close(id: string) {
    return this.prisma.trade.update({
      where: { id },
      data: { isOpen: false },
    });
  }

  async remove(id: string) {
    return this.prisma.trade.delete({ where: { id } });
  }

  async removeAll() {
    return this.prisma.trade.deleteMany({});
  }
}
