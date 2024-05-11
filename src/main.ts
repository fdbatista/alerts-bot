import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DEFAULT_VALUES } from './modules/_common/env/_constants';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const appPort = parseInt(process.env.APP_PORT ?? DEFAULT_VALUES.APP_PORT);
  console.log(`Service listening on port ${appPort}`);

  await app.listen(appPort);
}

bootstrap();
