import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { TechnicalAnalysisController } from './technical-analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { PatternsService } from './patterns.service';
import { EntrypointDetectorService } from './entrypoint-detector.service';
import { TickerModule } from '../ticker/ticker.module';
import { AssetModule } from '../asset/asset.module';
import { IndicatorCalculatorService } from './listeners/indicator-calculator.service';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';

@Module({
  imports:
    [
      TypeOrmModule.forFeature([Ticker, Rsi, Stoch]),
      TickerModule,
      AssetModule
    ],
  providers: [
    IndicatorsService,
    PatternsService,
    EntrypointDetectorService,
    IndicatorCalculatorService,
  ],
  controllers: [TechnicalAnalysisController],
  exports: [IndicatorsService, PatternsService, EntrypointDetectorService],
})
export class TechnicalAnalysisModule { }
