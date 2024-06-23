import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TickerService } from './ticker.service';

export const TICKERS_PER_MINUTE = 3;
const TICKERS_INTERVAL = 60 / TICKERS_PER_MINUTE;

@Injectable()
export class TickerSchedulerService {
  constructor(
    private readonly tickerService: TickerService,
  ) { }

  @Cron(`*/${TICKERS_INTERVAL} * * * * *`)
  upsertTicker() {
    this.tickerService.upsertTicker()
  }

  @Cron('0 0 * * * *')
  deleteOldTickers() {
    this.tickerService.deleteOldTickers()
  }
}
