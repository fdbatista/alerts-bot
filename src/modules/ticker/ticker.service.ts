import { Injectable } from '@nestjs/common';
import { LoggerUtil } from 'src/utils/logger.util';
import { Asset } from 'src/database/entities/asset';
import { TickerRepository } from './ticker.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { AssetRepository } from './asset.repository';
import { ASSET_TYPES } from 'src/modules/_common/util/asset-types.util';
import { TickerInsertedDTO } from './dto/ticker-inserted.dto';
import { BUILD_INDICATORS } from '../technical-analysis/indicators-builder/config';
import { WebullService } from '../exchange/webull/webull.service';
import { CandlestickDTO } from '../_common/dto/ticker-dto';

@Injectable()
export class TickerService {
    constructor(
        private readonly tickerRepository: TickerRepository,
        private readonly assetRepository: AssetRepository,
        private readonly webullService: WebullService,
        private readonly eventEmitter: EventEmitter2
    ) { }

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

    async loadAllAssetsTickers() {
        const assets = await this.assetRepository.getActiveAssets();
        this.upsertTickers(assets)
    }

    async loadCryptoTickers() {
        const assets = await this.assetRepository.getActiveAssetsByType(ASSET_TYPES.CRYPTOCURRENCY);
        this.upsertTickers(assets)
    }

    async deleteOldTickers(): Promise<void> {
        await this.tickerRepository.deleteOldTickers();
    }

    private async upsertTickers(assets: Asset[]): Promise<void> {
        const externalIds = assets.map((asset: Asset) => asset.externalId)

        try {
            const tickers = await this.webullService.fetchTickers(externalIds);

            const validTickers = [];
            const validIds = [];

            for (const ticker of tickers) {
                const { externalId } = ticker;
                const asset = assets.find((asset: Asset) => asset.externalId === externalId)

                if (asset) {
                    const timestamp = new Date(ticker.timestamp);
                    timestamp.setSeconds(0);
                    timestamp.setMilliseconds(0);

                    validTickers.push({ ...ticker, assetId: asset.id, timestamp });
                    validIds.push(asset.id);
                }
            }

            await this.tickerRepository.upsertTickers(validTickers);

            const payload = new TickerInsertedDTO(assets, validTickers);
            this.eventEmitter.emit(BUILD_INDICATORS, payload);
        } catch (error) {
            const { message } = error;
            LoggerUtil.error(message);
        }
    }

    async getCandlesticks(assetId: number, candleDuration: number, take: number): Promise<CandlestickDTO[]> {
        const tickers = await this.tickerRepository.getCandlesticks(assetId, candleDuration, take);

        return tickers.reverse();
    }

}
