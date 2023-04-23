import { Controller, Get, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
    private configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<any> {
    this.logger.log('HealthController onApplicationBootstrap');
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // The process should successfully ping NestJS docs
      () => this.http.pingCheck('docs.nestjs.com', 'https://docs.nestjs.com'),
      // The process should successfully notify Discovery Service of its status
      () => {
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
