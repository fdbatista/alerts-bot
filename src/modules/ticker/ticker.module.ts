import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { Asset } from 'src/database/entities/asset';
import { EnvModule } from '../_common/env/env.module';
import { AssetType } from 'src/database/entities/asset-type';
import { TickerRepository } from './ticker.repository';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';
import { AssetRepository } from './asset.repository';
import { WebullModule } from '../exchange/webull/webull.module';
import { WebullService } from '../exchange/webull/webull.service';
import { TickerService } from './ticker.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticker,
      Asset,
      AssetType,
      Rsi,
      Stoch,
    ]),
    EnvModule,
    HttpModule,
    WebullModule,
  ],
  providers: [WebullService, TickerRepository, TickerService, AssetRepository],
  exports: [TickerService],
})
export class TickerModule { }
