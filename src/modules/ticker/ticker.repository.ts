import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { CandlestickDTO } from '../_common/dto/ticker-dto';

const CANDLESTICKS_QUERY = `
    SELECT 
        time_bucket(':minutes minutes', timestamp) + interval ':minutes minutes' AS bucket,
        first(price, timestamp) AS open,
        MAX(price) AS high,
        MIN(price) AS low,
        last(price, timestamp) AS close
    FROM ticker
    WHERE timestamp >= now() - interval ':length minutes' and asset_id = $1
    GROUP BY bucket
    ORDER BY bucket;
`

@Injectable()
export class TickerRepository {
    constructor(
        @InjectRepository(Ticker)
        private readonly tickerRepository: Repository<Ticker>,
    ) { }

    public async generateCandlesticks(assetId: number, interval: number, length: number): Promise<CandlestickDTO[]> {
        const query = CANDLESTICKS_QUERY
            .replaceAll(':minutes', interval.toString())
            .replaceAll(':length', `${interval * length}`);

        return this.tickerRepository.query(query, [assetId]);
    }

    public async deleteOldTickers(): Promise<void> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 3650);

        await this.tickerRepository
            .createQueryBuilder('ticker')
            .delete()
            .where('ticker.timestamp < :timestamp', { startDate })
            .execute();
    }

    async upsertTickers(data: Ticker[]): Promise<void> {
        await this.tickerRepository.upsert(data, ['assetId', 'timestamp']);
    }

}
