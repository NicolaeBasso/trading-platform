import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { PrismaService } from '../../prisma/prisma.service';
import { CapitalComGateway } from '../capital-com/cc.ws.gateway.service';

@WebSocketGateway({
  namespace: 'account',
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class AccountGateway {
  private readonly logger = new Logger(AccountGateway.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly capitalComGateway: CapitalComGateway,
  ) {}

  @WebSocketServer()
  server;

  @SubscribeMessage('balance')
  async handleBalanceEvent(@MessageBody() data: any): Promise<WsResponse<any>> {
    try {
      // console.log('balance', data);

      const user = await this.prismaService.user.findUnique({
        where: { email: 'test@mail.com' },
      });
      const trades = await this.prismaService.trade.findMany({
        where: { isOpen: true },
      });

      const userFunds = user.balance;
      const accountData = trades.reduce(
        (acc, trade) => {
          const {
            pair,
            isLong,
            tradeSize,
            marginSize,
            priceOpened,
            leverageRatio,
          } = trade;

          const quoteType = isLong ? 'bid' : 'ofr';
          const currentPrice = this.capitalComGateway.pairs[pair]?.[quoteType];

          acc.margin += marginSize;

          if (isLong)
            acc.profit +=
              (currentPrice - priceOpened) * tradeSize * leverageRatio;
          else
            acc.profit -=
              (currentPrice - priceOpened) * tradeSize * leverageRatio;

          if (acc.profit > 0) acc.equity = acc.funds + acc.profit;
          else acc.equity = acc.funds - acc.profit;

          acc.available = acc.equity - acc.margin;

          return acc;
        },
        { funds: user.balance, margin: 0, profit: 0, equity: 0, available: 0 },
      );

      const funds = user.balance;
      const equity = accountData.equity;
      const available = accountData.available;
      const margin = accountData.margin;
      const profit = accountData.profit;

      return {
        event: 'balance',
        data: {
          message: 'balance response',
          user,
          trades,
          funds: userFunds,
          equity,
          available,
          margin,
          profit,
        },
      };
    } catch (error) {
      this.logger.debug(error);
    }
  }
}
