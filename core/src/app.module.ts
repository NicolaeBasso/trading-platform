import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { TradeModule } from './trades/trade.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'dev.docker.env',
      isGlobal: true,
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
    JwtModule,
    PassportModule,
    PrismaModule,
    HealthModule,
    TradeModule,
    AuthModule,
    UsersModule,
    ThrottlerModule.forRoot({
      ttl: 5,
      limit: 5,
    }),
  ],
})
export class AppModule {}
