import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { PrismaService } from '../../prisma/prisma.service';

@WebSocketGateway({
  namespace: 'account',
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class AccountGateway {
  constructor(private readonly prismaService: PrismaService) {}

  @WebSocketServer()
  server;

  @SubscribeMessage('balance')
  async handleBalanceEvent(@MessageBody() data: any): Promise<WsResponse<any>> {
    console.log('balance', data);

    const user = await this.prismaService.user.findUnique({
      where: { email: 'test@mail.com' },
    });
    const trades = await this.prismaService.trade.findMany({});

    const userFunds = user.balance;
    const userMargin = trades.reduce((acc, trade, idx, arr) => {
      return acc + trade.marginSize;
    }, 0);

    const funds = user.balance;
    let equity;
    let available;
    let margin;
    let profit;

    return {
      event: 'balance',
      data: {
        message: 'balance response',
        user,
        trades,
        funds: userFunds,
        equity,
        available,
        margin: userMargin,
        profit,
      },
    };
  }
}
