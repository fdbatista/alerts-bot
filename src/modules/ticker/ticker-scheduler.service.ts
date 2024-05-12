import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { TickerService } from './ticker.service';

@Injectable()
export class TickerSchedulerService {
  constructor(
    private readonly tickerService: TickerService,
  ) { }

  @Interval(5000)
  handleInterval() {
    this.tickerService.upsertTicker()
    console.log('Called every 5 seconds');
  }
}
