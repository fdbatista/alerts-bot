import { Injectable } from '@nestjs/common';
import { LoggerUtil } from 'src/utils/logger.util';
import { Asset } from 'src/database/entities/asset';
import { WebullService } from './webull.service';
import { TickerRepository } from './ticker.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TICKERS_INSERTED_MESSAGE } from '../technical-analysis/listeners/config';
import { AssetRepository } from './asset.repository';
import { ASSET_TYPES } from 'src/modules/_common/util/asset-types.util';

@Injectable()
export class TickerIngesterService {
    constructor(
        private readonly tickerRepository: TickerRepository,
        private readonly assetRepository: AssetRepository,
        private readonly webullService: WebullService,
        private readonly eventEmitter: EventEmitter2
    ) { }

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

            this.eventEmitter.emit(TICKERS_INSERTED_MESSAGE, assets);
        } catch (error) {
            const { message } = error;
            LoggerUtil.error(message);
        }
    }

}
