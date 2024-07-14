import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { TickerDTO } from '../_common/dto/ticker-dto';

const TICKER_QUERY = `
    select distinct on (interval_start)
        interval_start,
        open,
        close,
        high,
        low
    from (
        select 
            timestamp,
            open,
            close,
            high,
            low,
            date_trunc('minute', timestamp) - 
            interval '1 minute' * (extract(minute from timestamp) % :candleDuration) AS interval_start
        from ticker
        where
        asset_id = :assetId
    ) subquery
    order by interval_start desc, timestamp desc;
`;

@Injectable()
export class TickerRepository {
    constructor(
        @InjectRepository(Ticker)
        private readonly repository: Repository<Ticker>,
    ) { }

    async getTickers(candleDuration: number, assetId: number): Promise<TickerDTO[]> {
        const query = TICKER_QUERY
            .replace(':candleDuration', candleDuration.toString())
            .replace(':assetId', assetId.toString());
        
        const tickers = await this.repository.query(query);
        return tickers;
    }

    async deleteOldTickers(): Promise<void> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 3650);

        const timestamp = startDate.getTime();

        await this.repository
            .createQueryBuilder('ticker')
            .delete()
            .where('ticker.timestamp < :timestamp', { timestamp })
            .execute();
    }

    async upsertTickers(data: TickerDTO[]): Promise<void> {
        await this.repository.upsert(data, ['assetId', 'timestamp']);
    }

}
