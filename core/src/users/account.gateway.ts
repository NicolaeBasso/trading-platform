import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { PrismaService } from '../../prisma/prisma.service';

@WebSocketGateway()
export class ProfileGateway {
  constructor(private readonly prismaService: PrismaService) {}

  @WebSocketServer()
  server;

  @SubscribeMessage('balance')
  async handleBalanceEvent(@MessageBody() data: any) {
    const { userId } = data;

    // Retrieve user profile data from Prisma
    const userProfile = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    // Perform any additional business logic or transformations

    // Emit the profile data to the connected client
    this.server.emit('balance', userProfile);
  }
}
