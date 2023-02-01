import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrismaModule } from '../prisma/prisma.module';
import { ThrottlerModule } from "@nestjs/throttler";
import { LoggingInterceptor } from './utils/interceptors/logging.interceptor';
import { HealthModule } from './health/health.module';
import { TradeModule } from './trade/trade.module';
import { TradeService } from './trade/trade.service';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './es/es.module';
import { DBAdapterModule } from './db-adapter/adapter.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV === 'DOCKER_DEV' ? 'dev.docker.env': '.env',
      isGlobal: true,
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
    JwtModule,
    PassportModule,
    // SearchModule,
    PrismaModule,
    HealthModule,
    TradeModule,
    AuthModule,
    DBAdapterModule,
    UserModule,
    ThrottlerModule.forRoot({
      ttl: 5,
      limit: 5,
    }),
  ],
  providers: [
    TradeService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
  ],
})
export class AppModule {}
