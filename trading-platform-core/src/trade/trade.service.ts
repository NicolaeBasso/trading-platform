import { Injectable } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Trade } from './entities/trade.entity';

@Injectable()
export class TradeService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  create(createTradeDto: CreateTradeDto) {
    // const tradeCreated = this.prisma.trade.create({
    //   data: { id: 'x', isOpen: true, priceOpen: 1000 },
    // });
    return 'This action adds a new trade';
  }

  async findAll(): Promise<Trade[]> {
    return [];
    // return `This action returns all trades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trade`;
  }

  update(id: number, updateTradeDto: UpdateTradeDto) {
    return `This action updates a #${id} trade`;
  }

  remove(id: number) {
    return `This action removes a #${id} trade`;
  }
}
