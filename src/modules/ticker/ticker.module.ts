import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticker } from 'src/database/entities/ticker';
import { Asset } from 'src/database/entities/asset';

import { TickerController } from './ticker.controller';
import { TickerSchedulerService } from './ticker-scheduler.service';
import { TickerIngesterService } from './ticker-ingester.service';
import { WebullService } from './webull.service';
import { EnvModule } from '../_common/env/env.module';
import { HttpModule } from '../_common/http/http.module';
import { AssetType } from 'src/database/entities/asset-type';
import { Strategy } from 'src/database/entities/strategy';
import { StrategySignal } from 'src/database/entities/strategy-signal';
import { TickerRepository } from './ticker.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Ticker, Asset, AssetType, Strategy, StrategySignal]), EnvModule, HttpModule],
  providers: [TickerIngesterService, TickerSchedulerService, WebullService, TickerRepository],
  exports: [TickerIngesterService, TickerSchedulerService],
  controllers: [TickerController],
})
export class TickerModule { }
