import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as _ from 'lodash';

import { Ticker } from 'src/database/entities/ticker';
import { rsi, simpleMovingAverage, stoch, ema } from 'indicatorts';

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

@Injectable()
export class IndicatorService {
  constructor(
    @InjectRepository(Ticker)
    private readonly stockPriceRepository: Repository<Ticker>,
  ) { }

  async calculateIndicators(assetId: number, intervals: number[], smaLengths: number[]): Promise<any> {
    const results = [];

    for (const bucket of intervals) {
      const candlesticks = await this.generateCandlesticks(assetId, bucket, 200);
      const closingsAsc = candlesticks.map(c => c.close).reverse();
      const highsAsc = candlesticks.map(c => c.high).reverse();
      const lowsAsc = candlesticks.map(c => c.low).reverse();
      
      const rsiResult = rsi(closingsAsc, { period: 14 });
      const stockResult = stoch(highsAsc, lowsAsc, closingsAsc, { dPeriod: 14, kPeriod: 3 });
      const emaResult = ema(closingsAsc, { period: 45 });

      const smaResult = [];

      for (const length of smaLengths) {
        const sma2 = simpleMovingAverage(closingsAsc, { period: length })

        smaResult.push({
          length,
          sma: sma2.at(-1),
        });
      }

      results.push({
        interval: bucket,
        rsi: rsiResult.at(-1),
        stoch: {
          k: stockResult.k.at(-1),
          d: stockResult.d.at(-1),
        },
        sma: smaResult,
        ema: emaResult.at(-1),
      });
    }

    return results;
  }

  async generateCandlesticks(assetId: number, interval: number, length: number): Promise<any[]> {
    const query = CANDLESTICKS_QUERY
      .replace(/:minutes/g, interval.toString())
      .replace(/:length/g, `${interval * length}`);

    return this.stockPriceRepository.query(query, [assetId]);
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
