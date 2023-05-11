import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocket } from 'ws';

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

  private ws = null;

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
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    const event = 'events';
    return { event, data: { data, received: true } };
  }

  @SubscribeMessage('course')
  handleRequestLiveCourse(
    @MessageBody() clientData: { pair: string } & any,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    const pairsRequested = clientData?.pairs || [];
    const event = 'course';

    const currentSubscriptions = [...Object.keys(this.subscriptions)];

    if (
      !pairsRequested.every((el) =>
        Object.keys(this.subscriptions).includes(el),
      )
    )
      this.subscribeMessage([
        ...new Set([...pairsRequested, ...currentSubscriptions]),
      ]);

    const toSend = {};
    Object.entries(this.pairs).map((ticker) => {
      if (pairsRequested.includes(ticker[0])) toSend[ticker[0]] = ticker[1];
    });

    // console.log('toSend', toSend);

    return {
      event,
      data: {
        clientData,
        pairs: toSend,
        received: true,
      },
    };
  }

  constructor(private readonly httpService: HttpService) {
    this.ws = new WebSocket(
      'wss://api-streaming-capital.backend-capital.com/connect',
    );

    this.logger.debug(
      'CapitalCom WebSocket connectivity config',
      JSON.stringify(this.ws),
    );

    this.ws.on('open', async () => {
      this.subscribeMessage();
    });

    this.ws.on('message', (message: string) => {
      const data = JSON.parse(message);

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
      this.ws.send(JSON.stringify(pingMessage));
    }, 500000);

    this.createSessionWithCapitalCom().then(() => {
      this.subscribeMessage();

      return setInterval(async () => {
        this.logger.debug('In axios interval!');

        this.createSessionWithCapitalCom().then(() => {
          this.subscribeMessage();
        });
      }, 9 * 60 * 1000);
    });
  }

  // Subscribe to market data for epics like ['BTCUSD', 'US100', 'OIL_CRUDE']
  private async subscribeMessage(epics: string[] = []) {
    // console.log('epics to subscribe to =', epics);

    const subscribeMessage = {
      destination: 'marketData.subscribe',
      correlationId: '1',
      cst: this.cst,
      securityToken: this.securityToken,
      payload: {
        epics: [...epics, 'BTCUSD', 'US100'],
      },
    };
    this.ws.send(JSON.stringify(subscribeMessage));
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
            this.logger.debug('Created session with capital.com');
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
