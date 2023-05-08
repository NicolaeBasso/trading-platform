import { Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HttpService } from '@nestjs/axios';
import { WebSocket } from 'ws';
// import { Socket

// @Injectable()
@WebSocketGateway({
  namespace: 'market',
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class CapitalComGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CapitalComGateway.name);

  // Access token
  // private cst = 'wce2gZ5p4R3QaF3XP6L6gR55';
  private cst = null;
  // Account token or ID
  // private securityToken = 'bFTDQkA0ofTrKhrpzF7gFJGD1dfhEEV';
  private securityToken = null;

  public subscriptions = {}; // Store subscription statuses by epic
  public pairs = {};

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: unknown,
    // @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    console.log('data', data);
    const event = 'events';
    return { event, data: { data, received: true } };
  }

  @SubscribeMessage('course')
  handleRequestLiveCourse(
    @MessageBody() data: { pair: string } & any,
    // @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    console.log('data', data);
    const event = 'course';
    console.log(this.pairs);

    return { event, data: { data, pairs: this.pairs, received: true } };
  }

  constructor(private readonly httpService: HttpService) {
    const ws = new WebSocket(
      'wss://api-streaming-capital.backend-capital.com/connect',
    );

    this.logger.debug(
      'CapitalCom WebSocket connectivity config',
      JSON.stringify(ws),
    );

    // Subscribe to market data for epics like ['BTCUSD', 'US100', 'OIL_CRUDE']
    const subscribeMessage = async () => {
      const subscribeMessage = {
        destination: 'marketData.subscribe',
        correlationId: '1',
        cst: this.cst,
        securityToken: this.securityToken,
        payload: {
          epics: ['BTCUSD', 'US100', 'OIL_CRUDE'],
        },
      };
      ws.send(JSON.stringify(subscribeMessage));
    };

    ws.on('open', async () => {
      subscribeMessage();
    });

    ws.on('message', (message: string) => {
      const data = JSON.parse(message);

      // this.logger.debug('Message received');

      if (data.destination === 'marketData.subscribe') {
        // Store subscription status by epic
        const subscriptions = data.payload.subscriptions;
        for (const epic in subscriptions) {
          if (subscriptions.hasOwnProperty(epic)) {
            this.subscriptions[epic] = subscriptions[epic];
          }
        }
      } else if (
        data.destination === 'quote' &&
        this.subscriptions[data.payload.epic] === 'PROCESSED'
      ) {
        // Receive market data updates for subscribed epics
        // console.info(data.payload);

        // Store epic update to pairs dictionary
        this.pairs[data.payload.epic] = data.payload;
      }
    });

    // Ping the server every x milliseconds to keep connection alive
    setInterval(() => {
      const pingMessage = {
        destination: 'ping',
        correlationId: '2',
        cst: this.cst,
        securityToken: this.securityToken,
      };
      ws.send(JSON.stringify(pingMessage));
    }, 500000);

    this.createSessionWithCapitalCom().then(() => {
      subscribeMessage();

      return setInterval(async () => {
        this.logger.debug('In axios interval!');

        this.createSessionWithCapitalCom().then(() => {
          subscribeMessage();
        });
      }, 9 * 60 * 1000);
    });
  }

  private createSessionWithCapitalCom = async (): Promise<void> => {
    return this.httpService
      .axiosRef({
        method: 'POST',
        url: 'https://demo-api-capital.backend-capital.com/api/v1/session',
        data: {
          identifier: 'waffle4everyone@gmail.com',
          password: 'vrewth3V!!*&F,,',
          encryptedPassword: 'false',
        },
        headers: {
          'X-CAP-API-KEY': 'qUBPe2IICLeKIkKD',
        },
      })
      .then(
        (fullfilled) => {
          this.cst = fullfilled.headers.cst;
          this.securityToken = fullfilled.headers['x-security-token'];

          if (this.cst && this.securityToken)
            this.logger.debug(
              'Created session with capital.com',
              // JSON.stringify(fullfilled.headers),
            );
          else this.logger.error('Failed to create session with capital.com!');
        },
        (rejected) => {
          this.logger.warn(rejected);
        },
      )
      .catch((error) => {
        this.logger.error(error);
      });
  };
}
