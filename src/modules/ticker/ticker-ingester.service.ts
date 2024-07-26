import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerUtil } from 'src/utils/logger.util';
import { TickerDTO } from '../_common/dto/ticker-dto';
import { Asset } from 'src/database/entities/asset';
import { WebullService } from './webull.service';
import { TickerRepository } from './ticker.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TICKERS_INSERTED_MESSAGE } from '../technical-analysis/listeners/config';

@Injectable()
export class TickerIngesterService {
    constructor(
        private readonly tickerRepository: TickerRepository,
        @InjectRepository(Asset)
        private readonly assetRepository: Repository<Asset>,
        private readonly webullService: WebullService,
        private readonly eventEmitter: EventEmitter2
    ) { }

    async loadAllAssetsTickers() {
        const ids = await this.getExternalIdsOfActiveAssets();
        this.upsertTickers(ids)
    }

    async getExternalIdsOfActiveAssets(): Promise<string[]> {
        const assets = await this.getActiveAssets();
        return assets.map((asset: Asset) => asset.externalId)
    }

    async loadCryptoTickers() {
        const ids = await this.getExternalIdsOfActiveAssetsByType('Cryptocurrency');
        this.upsertTickers(ids)
    }

    async getExternalIdsOfActiveAssetsByType(type: string): Promise<string[]> {
        const assets = await this.getActiveAssets();

        const result = []

        for (const asset of assets) {
            const typeEntity = await asset.type;
            const { name } = typeEntity

            if (name === type) {
                result.push(asset.externalId)
            }
        }

        return result;
    }

    private async getActiveAssets(): Promise<Asset[]> {
        return await this.assetRepository.find({
            where: { isActive: true },
            relations: ['type'],
        });
    }

    async deleteOldTickers(): Promise<void> {
        await this.tickerRepository.deleteOldTickers();
    }

    private async upsertTickers(ids: string[]): Promise<void> {
        try {
            const tickers = await this.webullService.getTickers(ids);

            const promises = tickers
                .map(async (ticker: TickerDTO) => {
                    const { externalId } = ticker;
                    const asset = await this.assetRepository.findOne({
                        where: { externalId }
                    });

                    if (asset) {
                        ticker.assetId = asset.id
                    }
                    return ticker;
                })

            const data = await Promise.all(promises)
            
            const validData = data
                .filter((ticker: TickerDTO) => ticker.assetId > -1)
                .map((ticker: TickerDTO) => {
                    const timestamp = new Date(ticker.timestamp);
                    timestamp.setSeconds(0);
                    timestamp.setMilliseconds(0);

                    return { ...ticker, timestamp };
                });

            await this.tickerRepository.upsertTickers(validData);

            this.eventEmitter.emit(TICKERS_INSERTED_MESSAGE);
            LoggerUtil.log('Tickers inserted');
        } catch (error) {
            const { message } = error;
            LoggerUtil.error(message);
        }
    }

}
