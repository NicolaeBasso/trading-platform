import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    HealthModule,
    ConfigModule.forRoot({
      envFilePath: process.env.ENV === 'DOCKER_DEV' ? 'dev.docker.env': '.env',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
