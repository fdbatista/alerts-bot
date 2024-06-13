import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TickerService } from './ticker.service';

@Injectable()
export class TickerSchedulerService {
  constructor(
    private readonly tickerService: TickerService,
  ) { }

  @Cron('* * * * *')
  handleInterval() {
    this.tickerService.upsertTicker()
  }
}
