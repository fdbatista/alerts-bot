import { Injectable } from '@nestjs/common';
import { LoggerUtil } from 'src/utils/logger.util';
import { TickerRepository } from './ticker.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { AssetRepository } from './asset.repository';
import { ASSET_TYPES } from 'src/modules/_common/util/asset-types.util';
import { TickerInsertedDTO } from './dto/ticker-inserted.dto';
import { BUILD_INDICATORS } from '../technical-analysis/indicators-builder/config';
import { WebullService } from '../exchange/webull/webull.service';
import { CandlestickDTO } from '../_common/dto/ticker-dto';
import { AssetDTO } from './dto/asset.dto';

@Injectable()
export class TickerService {
    constructor(
        private readonly tickerRepository: TickerRepository,
        private readonly assetRepository: AssetRepository,
        private readonly webullService: WebullService,
        private readonly eventEmitter: EventEmitter2
    ) { }

    public async getCandlesticks(assetId: number, candleDuration: number, take: number): Promise<CandlestickDTO[]> {
        const tickers = await this.tickerRepository.getCandlesticks(assetId, candleDuration, take);

        return tickers.reverse();
    }

    @Cron('* 0-14 * * 1-5')  // Every minute from 00:00 to 14:59 on Monday to Friday
    async loadCryptosFrom00To14() {
        this.loadCryptoTickers()
    }

    @Cron('0-29 15 * * 1-5')  // From 15:00 to 15:29 on Monday to Friday
    async loadCryptosFrom1500To1529() {
        this.loadCryptoTickers()
    }

    @Cron('30-59 15 * * 1-5') // From 15:30 to 15:59 on Monday to Friday
    async loadAllAssetsFrom1530To1559() {
        this.loadAllAssetsTickers()
    }

    @Cron('* 16-21 * * 1-5') // Every minute from 16:00 to 21:59 on Monday to Friday
    async loadAllAssetsFrom14To21() {
        this.loadAllAssetsTickers()
    }

    @Cron('* 22-23 * * 1-5')  // Every minute from 22:00 to 23:59 on Monday to Friday
    async loadCryptosFrom22To23() {
        this.loadCryptoTickers()
    }

    @Cron(`0 * * * * 6,7`)  // Every minute on Saturday and Sunday
    async loadCryptosOnWeekends() {
        this.loadCryptoTickers()
    }

    @Cron('0 0 * * *')
    cleanUp() {
        this.deleteOldTickers()
    }

    private async loadAllAssetsTickers() {
        const assets = await this.assetRepository.getActiveAssets();
        this.upsertTickers(assets)
    }

    private async loadCryptoTickers() {
        const assets = await this.assetRepository.getActiveAssets(ASSET_TYPES.CRYPTOCURRENCY);
        this.upsertTickers(assets)
    }

    private async deleteOldTickers(): Promise<void> {
        await this.tickerRepository.deleteOldTickers();
    }

    private async upsertTickers(assets: AssetDTO[]): Promise<void> {
        try {
            const tickers = await this.webullService.fetchTickers(assets);
            await this.tickerRepository.upsertTickers(tickers);

            const payload = new TickerInsertedDTO(assets, tickers);
            this.eventEmitter.emit(BUILD_INDICATORS, payload);
        } catch (error) {
            const { message } = error;
            LoggerUtil.error(message);
        }
    }
}
