import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(4000);
}
bootstrap();
