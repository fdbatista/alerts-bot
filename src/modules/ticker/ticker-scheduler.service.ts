import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TickerIngesterService } from './ticker-ingester.service';

@Injectable()
export class TickerSchedulerService {
  constructor(
    private readonly tickerIngesterService: TickerIngesterService,
  ) { }
  
  @Cron('* 0-14 * * 1-5')  // Every minute from 00:00 to 14:59 on Monday to Friday
  async loadCryptosFrom00To14() {
    this.tickerIngesterService.loadCryptoTickers()
  }

  @Cron('0-29 15 * * 1-5')  // From 15:00 to 15:29 on Monday to Friday
  async loadCryptosFrom1500To1529() {
    this.tickerIngesterService.loadCryptoTickers()
  }

  @Cron('30-59 15 * * 1-5') // From 15:30 to 15:59 on Monday to Friday
  async loadAllAssetsFrom1530To1559() {
    this.tickerIngesterService.loadAllAssetsTickers()
  }

  @Cron('* 16-21 * * 1-5') // Every minute from 16:00 to 21:59 on Monday to Friday
  async loadAllAssetsFrom14To21() {
    this.tickerIngesterService.loadAllAssetsTickers()
  }

  @Cron('* 22-23 * * 1-5')  // Every minute from 22:00 to 23:59 on Monday to Friday
  async loadCryptosFrom22To23() {
    this.tickerIngesterService.loadCryptoTickers()
  }

  @Cron(`0 * * * * 6,7`)  // Every minute on Saturday and Sunday
  async loadCryptosOnWeekends() {
    this.tickerIngesterService.loadCryptoTickers()
  }

  @Cron('0 0 * * *')
  deleteOldTickers() {
    this.tickerIngesterService.deleteOldTickers()
  }
}
