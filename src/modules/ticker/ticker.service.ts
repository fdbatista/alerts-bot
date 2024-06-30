import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { LoggerUtil } from 'src/utils/logger.util';
import { TickerDTO } from '../_common/dto/ticker-dto';
import { Asset } from 'src/database/entities/asset';
import { WebullService } from './webull.service';

@Injectable()
export class TickerService {
    constructor(
        @InjectRepository(Ticker)
        private readonly tickerRepository: Repository<Ticker>,
        @InjectRepository(Asset)
        private readonly assetRepository: Repository<Asset>,
        private readonly webullService: WebullService,
    ) { }

    async loadAllAssetsTickers() {
        const ids = await this.webullService.getExternalIdsOfActiveAssets();
        this.upsertTickers(ids)
    }

    async loadCryptoTickers() {
        const ids = await this.webullService.getExternalIdsOfActiveAssetsByType('Cryptocurrency');
        this.upsertTickers(ids)
    }

    async deleteOldTickers(): Promise<void> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 3650);

        const timestamp = startDate.getTime();

        await this.tickerRepository
            .createQueryBuilder('ticker')
            .delete()
            .where('ticker.timestamp < :timestamp', { timestamp })
            .execute();
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
            const validData = data.filter((ticker: TickerDTO) => ticker.assetId > -1);

            await this.tickerRepository.upsert(validData, ['assetId', 'timestamp']);

            LoggerUtil.log('Tickers inserted');
        } catch (error) {
            const { message } = error;
            LoggerUtil.error(message);
        }
    }

}
