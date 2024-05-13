import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TickerService } from './ticker.service';

@Injectable()
export class TickerSchedulerService {
  constructor(
    private readonly tickerService: TickerService,
  ) { }

  @Cron('9,19,29,39,49,59 * * * * *')
  handleInterval() {
    this.tickerService.upsertTicker()
  }
}
