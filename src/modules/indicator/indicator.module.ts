import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicator.service';
import { IndicatorController } from './indicator.controller';

@Module({
  providers: [IndicatorsService],
  controllers: [IndicatorController]
})
export class IndicatorsModule {}
