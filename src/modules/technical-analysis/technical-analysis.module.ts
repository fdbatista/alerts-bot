import { Module } from '@nestjs/common';
import { IndicatorsController } from './indicator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { PatternsService } from './patterns.service';
import { EntrypointDetectorService } from './entrypoint-detector.service';
import { TickerModule } from '../ticker/ticker.module';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';
import { RsiRepository } from './indicators-builder/repository/rsi.repository';
import { StochRepository } from './indicators-builder/repository/stoch.repository';
import { Ema } from 'src/database/entities/ema';
import { EmaRepository } from './indicators-builder/repository/ema.repository';
import { IndicatorService } from './indicators-builder/indicator-calculator.service';

@Module({
  imports:
    [
      TypeOrmModule.forFeature([Ticker, Rsi, Stoch, Ema]),
      TickerModule,
    ],
  providers: [
    PatternsService,
    EntrypointDetectorService,
    IndicatorService,
    RsiRepository,
    StochRepository,
    EmaRepository,
  ],
  controllers: [IndicatorsController],
  exports: [PatternsService, EntrypointDetectorService],
})
export class TechnicalAnalysisModule { }
