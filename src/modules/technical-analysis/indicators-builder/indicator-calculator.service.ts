import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ticker } from 'src/database/entities/ticker';

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
    ORDER BY bucket desc;
`

const SMA_QUERY = `
    select avg(close) from (
        SELECT 
            time_bucket('1 minutes', timestamp) AS bucket,
            last(price, timestamp) AS close
        FROM ticker
        WHERE
            timestamp >= now() - interval '10 minutes'
            and asset_id = 8
        GROUP BY bucket
        order BY bucket desc) closings;
`

@Injectable()
export class IndicatorService {
    constructor(
        @InjectRepository(Ticker)
        private readonly stockPriceRepository: Repository<Ticker>,
    ) { }

    async calculateIndicators(assetId: number, intervals: number[], lengths: number[]): Promise<any> {
        const results = [];

        for (const interval of intervals) {
            const candlesticks = await this.generateCandlesticks(assetId, interval, 200);

            for (const length of lengths) {
                const intervalCandlesticks = candlesticks.slice(0, length);
                const sma = await this.calculateSMA(assetId, length, interval);
                const rsi = await this.calculateRSI(assetId, length, interval);
                const stoch = await this.calculateStoch(assetId, length, interval);
                const ema45 = await this.calculateEMA(assetId, 45, interval);

                results.push({
                    interval,
                    length: length,
                    candlesticks,
                    indicators: { sma, rsi, stoch: stoch, ema45 },
                });
            }
        }
        return results;
    }

    async generateCandlesticks(assetId: number, interval: number, length: number): Promise<any[]> {
        const query = CANDLESTICKS_QUERY
            .replace(/:minutes/g, interval.toString())
            .replace(/:length/g, `${interval * length}`);

        return this.stockPriceRepository.query(query, [assetId]);
    }

    async calculateSMA(assetId: number, length: number, interval: number): Promise<number> {
        const query = `
      SELECT AVG(price) AS sma
      FROM (
        SELECT price
        FROM ticker
        WHERE asset_id = $1
          AND timestamp > NOW() - INTERVAL $2
        ORDER BY timestamp DESC
        LIMIT $3
      ) AS recent_prices;
    `;
        const result = await this.stockPriceRepository.query(query, [assetId, interval, length]);
        return result[0]?.sma ?? 0;
    }

    async calculateRSI(assetId: number, length: number, interval: number): Promise<number> {
        const query = `
      WITH recent_prices AS (
        SELECT price,
               LAG(price) OVER (ORDER BY timestamp) AS prev_price
        FROM ticker
        WHERE asset_id = $1
          AND timestamp > NOW() - INTERVAL $2
        ORDER BY timestamp DESC
        LIMIT $3
      ),
      gains AS (
        SELECT COALESCE(price - prev_price, 0) AS gain
        FROM recent_prices
        WHERE price > prev_price
      ),
      losses AS (
        SELECT COALESCE(prev_price - price, 0) AS loss
        FROM recent_prices
        WHERE price < prev_price
      )
      SELECT
        100 - (100 / (1 + AVG(gain) / NULLIF(AVG(loss), 0))) AS rsi
      FROM (
        SELECT (SELECT AVG(gain) FROM gains) AS gain,
               (SELECT AVG(loss) FROM losses) AS loss
      ) AS avgs;
    `;
        const result = await this.stockPriceRepository.query(query, [assetId, interval, length]);
        return result[0]?.rsi ?? 0;
    }

    async calculateStoch(assetId: number, length: number, interval: number): Promise<number> {
        const query = `
      WITH recent_prices AS (
        SELECT price
        FROM ticker
        WHERE asset_id = $1
          AND timestamp > NOW() - INTERVAL $2
        ORDER BY timestamp DESC
        LIMIT $3
      ),
      min_price AS (
        SELECT MIN(price) AS min_price
        FROM recent_prices
      ),
      max_price AS (
        SELECT MAX(price) AS max_price
        FROM recent_prices
      )
      SELECT
        100 * (price - min_price.min_price) / NULLIF(max_price.max_price - min_price.min_price, 0) AS stochastic
      FROM recent_prices, min_price, max_price
      ORDER BY timestamp DESC
      LIMIT 1;
    `;
        const result = await this.stockPriceRepository.query(query, [assetId, interval, length]);
        return result[0]?.stochastic ?? 0;
    }

    async calculateEMA(assetId: number, length: number, interval: number): Promise<number> {
        const smoothingFactor = 2 / (length + 1);

        const smaQuery = `
      SELECT AVG(price) AS sma
      FROM (
        SELECT price
        FROM ticker
        WHERE asset_id = $1
          AND timestamp > NOW() - INTERVAL $2
        ORDER BY timestamp DESC
        LIMIT $3
      ) AS initial_sma;
    `;

        const smaResult = await this.stockPriceRepository.query(smaQuery, [assetId, interval, length]);
        const initialEMA = smaResult[0]?.sma;

        if (initialEMA === undefined) return 0;

        const emaQuery = `
      SELECT price,
             LAG(price) OVER (ORDER BY timestamp DESC) AS prev_price
      FROM ticker
      WHERE asset_id = $1
        AND timestamp > NOW() - INTERVAL $2
      ORDER BY timestamp DESC
      LIMIT $3;
    `;

        const prices = await this.stockPriceRepository.query(emaQuery, [assetId, interval, length]);

        let ema = initialEMA;
        for (const { price } of prices) {
            ema = (price * smoothingFactor) + (ema * (1 - smoothingFactor));
        }

        return ema;
    }
}
