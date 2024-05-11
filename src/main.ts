import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { VersioningType } from '@nestjs/common';
import { DEFAULT_VALUES } from './modules/_commons/env/_constants';

config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const appPort = parseInt(process.env.APP_PORT ?? DEFAULT_VALUES.APP_PORT)

  await app.listen(appPort);
}

bootstrap();
