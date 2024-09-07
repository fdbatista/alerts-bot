import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { IndicatorsController } from './indicator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { PatternsService } from './patterns.service';
import { EntrypointDetectorService } from './entrypoint-detector.service';
import { TickerModule } from '../ticker/ticker.module';
import { IndicatorCalculatorService } from './indicators-builder/indicator-builder.service';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';
import { RsiRepository } from './indicators-builder/repository/rsi.repository';
import { StochRepository } from './indicators-builder/repository/stoch.repository';
import { Ema } from 'src/database/entities/ema';
import { EmaRepository } from './indicators-builder/repository/ema.repository';

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
  controllers: [IndicatorsController],
  exports: [IndicatorsService, PatternsService, EntrypointDetectorService],
})
export class TechnicalAnalysisModule { }
