import { Module } from '@nestjs/common';
import { TrendAnalysisService } from './trend-analysis.service';
import { TrendAnalysisController } from './trend-analysis.controller';

@Module({
  providers: [TrendAnalysisService],
  controllers: [TrendAnalysisController],
  exports: [TrendAnalysisService],
})
export class TrendAnalysisModule { }
