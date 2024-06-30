import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticker } from 'src/database/entities/ticker';
import { Asset } from 'src/database/entities/asset';

import { TickerController } from './ticker.controller';
import { TickerSchedulerService } from './ticker-scheduler.service';
import { TickerService } from './ticker.service';
import { WebullService } from './webull.service';
import { EnvModule } from '../_common/env/env.module';
import { HttpModule } from '../_common/http/http.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticker, Asset]), EnvModule, HttpModule],
  providers: [TickerService, TickerSchedulerService, WebullService],
  exports: [TickerService, TickerSchedulerService],
  controllers: [TickerController],
})
export class TickerModule { }
