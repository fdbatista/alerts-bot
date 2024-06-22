import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TickerService } from './ticker.service';

@Injectable()
export class TickerSchedulerService {
  constructor(
    private readonly tickerService: TickerService,
  ) { }

  @Cron('*/10 * * * * *')
  upsertTicker() {
    this.tickerService.upsertTicker()
  }

  @Cron('0 0 * * * *')
  deleteOldTickers() {
    this.tickerService.deleteOldTickers()
  }
}
