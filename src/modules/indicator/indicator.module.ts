import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicator.service';
import { IndicatorController } from './indicator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';

@Module({
  imports: [TypeOrmModule.forFeature([Ticker])],
  providers: [IndicatorsService],
  controllers: [IndicatorController]
})
export class IndicatorsModule {}
