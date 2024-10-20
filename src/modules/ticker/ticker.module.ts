import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticker } from 'src/database/entities/ticker';
import { Asset } from 'src/database/entities/asset';

import { TickerController } from './ticker.controller';
import { TickerIngesterService } from './ticker-ingester.service';
import { WebullService } from './webull.service';
import { EnvModule } from '../_common/env/env.module';
import { HttpModule } from '../_common/http/http.module';
import { AssetType } from 'src/database/entities/asset-type';
import { Strategy } from 'src/database/entities/strategy';
import { StrategySignal } from 'src/database/entities/strategy-signal';
import { TickerRepository } from './ticker.repository';
import { TickerService } from './ticker.service';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';
import { AssetRepository } from './asset.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticker,
      Asset,
      AssetType,
      Strategy,
      StrategySignal,
      Rsi,
      Stoch,
    ]),
    EnvModule,
    HttpModule
  ],
  providers: [TickerIngesterService, WebullService, TickerRepository, TickerService, AssetRepository],
  exports: [TickerIngesterService, TickerService],
  controllers: [TickerController],
})
export class TickerModule { }
