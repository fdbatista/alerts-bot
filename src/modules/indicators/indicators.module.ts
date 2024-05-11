import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';

@Module({
  providers: [IndicatorsService]
})
export class IndicatorsModule {}
