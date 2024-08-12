import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TickerIngesterService } from './ticker-ingester.service';

@Injectable()
export class TickerSchedulerService {
  constructor(
    private readonly tickerIngesterService: TickerIngesterService,
  ) { }
  
  @Cron(`* 0-9 * * 1-5`)  // Every minute from 00:00 to 09:59 on Monday to Friday
  async loadCryptosFrom00To09() {
    this.tickerIngesterService.loadCryptoTickers()
  }

  @Cron(`* 10-21 * * 1-5`) // Every minute from 10:00 to 21:59 on Monday to Friday
  async loadAllAssetsFrom10To21() {
    this.tickerIngesterService.loadAllAssetsTickers()
  }

  @Cron(`* 22-23 * * 1-5`)  // Every minute from 22:00 to 23:59 on Monday to Friday
  async loadCryptosFrom22To23() {
    this.tickerIngesterService.loadCryptoTickers()
  }

  @Cron(`* * * * 6,7`)  // Every minute on Saturday and Sunday
  async loadCryptosOnWeekends() {
    this.tickerIngesterService.loadCryptoTickers()
  }

  @Cron('0 0 * * *')
  deleteOldTickers() {
    this.tickerIngesterService.deleteOldTickers()
  }
}
