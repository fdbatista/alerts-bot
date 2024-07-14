import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TickerService } from './ticker.service';

@Injectable()
export class TickerSchedulerService {
  constructor(
    private readonly tickerService: TickerService,
  ) { }
  
  @Cron(`30-59 15 * * 1-5`) // Every minute from 15:30 to 15:59 on Monday to Friday
  async loadAllAssetsTickers1() {
    this.tickerService.loadAllAssetsTickers()
  }

  @Cron(`* 16-21 * * 1-5`)  // Every minute from 16:00 to 21:59 on Monday to Friday
  async loadAllAssetsTickers2() {
    this.tickerService.loadAllAssetsTickers()
  }
  
  @Cron(`* 0-14 * * 1-5`) // Every minute from 00:00 to 14:59 on Monday to Friday
  async loadCryptoTickers1() {
    this.tickerService.loadCryptoTickers()
  }

  @Cron(`0-29 15 * * 1-5`)  // Every minute from 15:00 to 15:29 on Monday to Friday
  async loadCryptoTickers2() {
    this.tickerService.loadCryptoTickers()
  }

  @Cron(`* 22-23 * * 1-5`)  // Every minute from 22:00 to 23:59 on Monday to Friday
  async loadCryptoTickers3() {
    this.tickerService.loadCryptoTickers()
  }

  @Cron(`* * * * 6,7`)  // Every minute on Saturday and Sunday
  async loadCryptoTickers4() {
    this.tickerService.loadCryptoTickers()
  }

  @Cron('0 0 * * *')
  deleteOldTickers() {
    this.tickerService.deleteOldTickers()
  }
}
