import { Injectable } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Trade } from './entities/trade.entity';
import { CapitalComGateway } from '../capital-com/cc.ws.gateway.service';
import { QuoteType } from './enums/trade-enums';
import { getUserBalance } from './utils/functions';
import { User } from '@prisma/client';

@Injectable()
export class TradeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly capitalComGateway: CapitalComGateway,
    private readonly prismaService: PrismaService,
  ) {}

  async create({
    user,
    createTradeDto,
  }: {
    user: Partial<User>;
    createTradeDto: CreateTradeDto;
  }) {
    const {
      pair,
      tradeSize,
      isLong = true,
      leverageRatio = 100,
    } = createTradeDto;
    const { id: userId } = user;

    const quoteType = `${isLong ? 'bid' : 'ofr'}`;
    const priceOpened = this.capitalComGateway.pairs[pair][quoteType];
    const tradeCreated = await this.prisma.trade.create({
      data: {
        userId,
        pair,
        tradeSize,
        isOpen: true,
        isLong,
        priceOpened: priceOpened,
        leverageRatio,
        marginSize: (priceOpened / leverageRatio) * tradeSize,
        leverageSize: priceOpened * leverageRatio * tradeSize,
        overnightInterest: 0.15,
        overnightFee: 0.1,
        ...createTradeDto,
      },
    });

    return tradeCreated;
  }

  async findAll(getAllTradesDto): Promise<Trade[] & any> {
    const { filter } = getAllTradesDto;

    if (!filter || filter === 'all') return this.prisma.trade.findMany({});
    else
      return this.prisma.trade.findMany({
        where: { isOpen: filter === 'open' ? true : false },
      });
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

  async close({ id, user }: { id: string; user: Partial<User> }) {
    const dbUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });
    const dbTrades = await this.prismaService.trade.findMany({
      where: { userId: dbUser.id },
    });

    const { equity } = {
      ...getUserBalance({
        user: dbUser,
        trades: dbTrades,
        livePairs: this.capitalComGateway.pairs,
        tradeId: id,
      }),
    };

    const updatedTrade = await this.prisma.trade.update({
      where: { id },
      data: { isOpen: false },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { balance: equity },
    });

    return updatedTrade;
  }

  async remove(id: string) {
    return this.prisma.trade.delete({ where: { id } });
  }

  async removeAll() {
    return this.prisma.trade.deleteMany({});
  }
}
