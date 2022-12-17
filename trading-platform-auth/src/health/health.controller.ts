import { Controller, Get, HttpException, Logger } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, tap } from 'rxjs';
import { ConfigService } from '@nestjs/config';
// import { HttpService } from '@nestjs/common';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger('HealthLogger');

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
    private configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<any> {
    const port = +this.configService.get<string>('AUTH_SERVICE_PORT');

    const res = await axios
    .post(`${this.configService.get<string>('DISCOVERY_URL')}/update`, {
        type: this.configService.get<string>('AUTH_SERVICE_APP_NAME'),
        ip: `${this.configService.get<string>('AUTH_SERVICE_CONTAINER_NAME')}`,
        port,
      })
      .catch((err) => {
        throw new HttpException(
          'Failed communicating with Discovery Service!',
          500,
        );
      });

    console.log(res.data);
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // The process should successfully ping NestJS docs
      () => this.http.pingCheck('docs.nestjs.com', 'https://docs.nestjs.com'),
      // The process should successfully notify Discovery Service of its status
      () => {
        console.log('Health!');

        return this.http.pingCheck('google.com', 'https://google.com');
      },
      // The process should not use more than 300MB memory
      () =>
        this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
      // The process should not have more than 300MB RSS memory allocated
      () =>
        this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024),
      // The used disk storage should not exceed the 50% of the available space
      () =>
        this.diskHealthIndicator.checkStorage('disk health', {
          thresholdPercent: 0.5,
          path: '/',
        }),
    ]);
  }
}
