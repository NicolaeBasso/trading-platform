import { Injectable } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Trade } from './entities/trade.entity';

@Injectable()
export class TradeService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async create(createTradeDto: CreateTradeDto) {
    const { pair, tradeSize } = createTradeDto;

    console.log('createTradeDto = ', { pair, tradeSize });

    const tradeCreated = await this.prisma.trade.create({
      data: {
        pair,
        tradeSize,
        isOpen: true,
        priceOpened: 200,
        overnightInterest: 0.15,
        overnightFee: 0.1,
      },
    });

    return tradeCreated;
  }

  async findAll(): Promise<Trade[] & any> {
    // return 'docker-godmode-on';
    return this.prisma.trade.findMany();
  }

  findOne(id: string) {
    return this.prisma.trade.findFirstOrThrow({ where: { id } });
  }

  update(id: string, updateTradeDto: UpdateTradeDto) {
    const { pair, tradeSize } = updateTradeDto;

    return this.prisma.trade.update({
      where: { id },
      data: { pair, tradeSize },
    });
  }

  close(id: string) {
    return this.prisma.trade.update({
      where: { id },
      data: { isOpen: false },
    });
  }

  remove(id: string) {
    return this.prisma.trade.delete({ where: { id } });
  }
}
