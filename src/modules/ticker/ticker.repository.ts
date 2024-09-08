import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { CandlestickDTO, TickerDTO } from '../_common/dto/ticker-dto';

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
            date_trunc('minute', timestamp) - interval '1 minute' * (extract(minute from timestamp) % :candleDuration) AS interval_start
        from ticker
        where asset_id = :assetId
    ) subquery
    order by interval_start desc, timestamp desc
    limit :take;
`;

@Injectable()
export class TickerRepository {
    constructor(
        @InjectRepository(Ticker)
        private readonly repository: Repository<Ticker>,
    ) { }

    async getCandlesticks(assetId: number, candleDuration: number, take: number): Promise<CandlestickDTO[]> {
        const query = TICKER_QUERY
            .replace(':assetId', assetId.toString())
            .replace(':candleDuration', candleDuration.toString())
            .replace(':take', take.toString());

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
