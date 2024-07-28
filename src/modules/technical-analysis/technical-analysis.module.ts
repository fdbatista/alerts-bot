import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { TechnicalAnalysisController } from './technical-analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { PatternsService } from './patterns.service';
import { EntrypointDetectorService } from './entrypoint-detector.service';
import { TickerModule } from '../ticker/ticker.module';
import { IndicatorCalculatorService } from './listeners/indicator-calculator.service';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';
import { RsiRepository } from './listeners/repository/rsi.repository';
import { StochRepository } from './listeners/repository/stoch.repository';
import { Ema } from 'src/database/entities/ema';
import { EmaRepository } from './listeners/repository/ema.repository';

@Module({
  imports:
    [
      TypeOrmModule.forFeature([Ticker, Rsi, Stoch, Ema]),
      TickerModule,
    ],
  providers: [
    IndicatorsService,
    PatternsService,
    EntrypointDetectorService,
    IndicatorCalculatorService,
    RsiRepository,
    StochRepository,
    EmaRepository,
  ],
  controllers: [TechnicalAnalysisController],
  exports: [IndicatorsService, PatternsService, EntrypointDetectorService],
})
export class TechnicalAnalysisModule { }
