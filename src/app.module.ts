import { config } from 'dotenv';
config()

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndicatorsModule } from './modules/indicator/indicator.module';
import { EnvModule } from './modules/_common/env/env.module';
import { BitsoModule } from './modules/exchange/bitso/bitso.module';
import { BitsoService } from './modules/exchange/bitso/bitso.service';
import { HttpService } from './modules/_common/http/http.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitsoSchedulerService } from './modules/exchange/bitso/bitso-scheduler.service';
import { BookModule } from './modules/book/book.module';
import { TickerModule } from './modules/ticker/ticker.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ["/src/database/entities/*.ts"],
      synchronize: false,
      autoLoadEntities: true,
    }),
    IndicatorsModule,
    EnvModule,
    BitsoModule,
    BookModule,
    TickerModule,
  ],
  controllers: [AppController],
  providers: [AppService, BitsoService, HttpService, BitsoSchedulerService],
})
export class AppModule {}
