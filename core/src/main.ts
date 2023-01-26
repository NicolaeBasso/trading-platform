import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { clientUrl } from './utils/constants';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // cors: { origin: clientUrl, credentials: true },
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(helmet());

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Trading Platform Core Service')
    .setDescription('Trading Platform Core Service license project')
    .setVersion('1.0.0')
    .addTag('core')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.CORE_SERVICE_PORT);
  console.log(
    `STARTED: ${process.env.CORE_SERVICE_APP_NAME} on port ${process.env.CORE_SERVICE_PORT}`,
  );
}
bootstrap();
