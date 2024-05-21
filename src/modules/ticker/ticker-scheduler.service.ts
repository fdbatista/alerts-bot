import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TickerService } from './ticker.service';

@Injectable()
export class TickerSchedulerService {
  constructor(
    private readonly tickerService: TickerService,
  ) { }

  @Cron('19,39,59 * * * * *')
  handleInterval() {
    this.tickerService.upsertTicker()
  }
}
