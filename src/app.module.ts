import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndicatorsModule } from './modules/indicator/indicator.module';
import { EnvModule } from './modules/_common/env/env.module';
import { BitsoModule } from './modules/exchange/bitso/bitso.module';
import { BitsoService } from './modules/exchange/bitso/bitso.service';
import { HttpService } from './modules/_common/http/http.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from 'dotenv';
config()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [],
      synchronize: false,
      autoLoadEntities: true,
    }),
    IndicatorsModule,
    EnvModule,
    BitsoModule,
  ],
  controllers: [AppController],
  providers: [AppService, BitsoService, HttpService],
})
export class AppModule {}
