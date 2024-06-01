import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { TechnicalAnalysisController } from './technical-analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { PatternsService } from './patterns.service';
import { EntrypointDetectorService } from './entrypoint-detector.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticker])],
  providers: [IndicatorsService, PatternsService, EntrypointDetectorService],
  controllers: [TechnicalAnalysisController],
  exports: [IndicatorsService, PatternsService, EntrypointDetectorService],
})
export class TechnicalAnalysisModule { }
