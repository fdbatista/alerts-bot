import { Module } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitsoModule } from '../exchange/bitso/bitso.module';
import { Ticker } from 'src/database/entities/ticker';
import { TickerController } from './ticker.controller';
import { TickerSchedulerService } from './ticker-scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticker]), BitsoModule],
  providers: [TickerService, TickerSchedulerService],
  controllers: [TickerController],
  exports: [TickerSchedulerService],
})
export class TickerModule {}
