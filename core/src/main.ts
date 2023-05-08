import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { clientUrl } from './utils/constants';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // cors: { origin: clientUrl, credentials: true },
  });
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(helmet());
  app.use(cookieParser());
  app.use(cors());

  const config = new DocumentBuilder()
    .setTitle('Trading Platform Core Service')
    .setDescription('Trading Platform Core Service license project')
    .setVersion('1.0.0')
    .addTag('core')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  logger.log(`STARTED on port ${process.env.PORT}`);
}
bootstrap();
