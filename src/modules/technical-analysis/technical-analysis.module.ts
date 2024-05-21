import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicator.service';
import { TechnicalAnalysisController } from './technical-analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { PatternsService } from './pattern.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticker])],
  providers: [IndicatorsService, PatternsService],
  controllers: [TechnicalAnalysisController],
  exports: [IndicatorsService, PatternsService],
})
export class TechnicalAnalysisModule { }
