import { config } from 'dotenv';
config()

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TechnicalAnalysisModule } from './modules/technical-analysis/technical-analysis.module';
import { EnvModule } from './modules/_common/env/env.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TickerModule } from './modules/ticker/ticker.module';
import { NotificatorModule } from './modules/notificator/notificator.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    TechnicalAnalysisModule,
    EnvModule,
    TickerModule,
    NotificatorModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
