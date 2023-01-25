import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { PrismaModule } from '../prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { TradeModule } from './trade/trade.module';
import { LoggingInterceptor } from './utils/interceptors/logging.interceptor';
import { TradeService } from './trade/trade.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PrometheusModule.register({
      path: "/metrics",
    }),
    PrismaModule,
    HealthModule,
    TradeModule,
  ],
  providers: [
    TradeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
