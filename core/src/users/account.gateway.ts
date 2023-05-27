import { Logger, Req, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { CapitalComGateway } from '../capital-com/cc.ws.gateway.service';
import { getUserBalance } from '../trades/utils/functions';
import { RolesWsGuard } from '../utils/guards/roles.ws.guard';
import { User } from '@prisma/client';

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

  @UseGuards(RolesWsGuard)
  @SubscribeMessage('balance')
  async handleBalanceEvent(
    @MessageBody() data: any,
    @Req() req: Request,
  ): Promise<WsResponse<any>> {
    const reqUser: Partial<User> = req.user;

    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: reqUser.id },
      });
      const trades = await this.prismaService.trade.findMany({
        where: { isOpen: true },
      });

      return {
        event: 'balance',
        data: {
          message: 'balance response',
          user,
          trades,
          ...getUserBalance({
            user,
            trades,
            livePairs: this.capitalComGateway.pairs,
          }),
        },
      };
    } catch (error) {
      this.logger.debug(error);
    }
  }
}
