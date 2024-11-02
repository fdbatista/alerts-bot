import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as _ from 'lodash';

import { Ticker } from 'src/database/entities/ticker';
import { rsi, simpleMovingAverage } from 'indicatorts';

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
    select avg(close) as sma from (
        SELECT 
            time_bucket(':minutes minutes', timestamp) AS bucket,
            last(price, timestamp) AS close
        FROM ticker
        WHERE
            timestamp >= now() - interval ':length minutes'
            and asset_id = $1
        GROUP BY bucket
        order BY bucket desc) closings;
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
      const closings = candlesticks.map(c => c.close);

      const rsiResult = rsi(closings.reverse(), { period: 14 });
      // const stoch = await this.calculateStoch(assetId, length, interval);
      // const ema45 = await this.calculateEMA(assetId, 45, interval);
      //simpleMovingAverage(closings, { period: 200 })
      
      const smaResult = [

      ];

      for (const length of smaLengths) {
        const sma2 = simpleMovingAverage(closings, { period: length })

        smaResult.push({
          length,
          sma: sma2.at(-1),
        });
      }

      results.push({
        interval: bucket,
        rsi: rsiResult.at(-1),
        smas: smaResult,
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

  async calculateSMA(assetId: number, length: number, interval: number): Promise<number> {
    const query = SMA_QUERY
      .replace(/:minutes/g, interval.toString())
      .replace(/:length/g, `${length * interval}`);
    const result = await this.stockPriceRepository.query(query, [assetId]);
    return result[0]?.sma ?? 0;
  }

  async calculateRSI(recentPrices: number[], length: number): Promise<number> {
    // Calculate gains and losses
    const gains: number[] = [];
    const losses: number[] = [];

    for (let i = 1; i < recentPrices.length; i++) {
      const currentPrice = recentPrices[i]
      const previousPrice = recentPrices[i - 1]
      const change = currentPrice - previousPrice;

      if (change > 0) {
        gains.push(change);
        losses.push(0);
      } else {
        gains.push(0);
        losses.push(Math.abs(change));
      }
    }

    // Calculate average gain and average loss
    const avgGain = gains.slice(0, length).reduce((acc, val) => acc + val, 0) / length;
    const avgLoss = losses.slice(0, length).reduce((acc, val) => acc + val, 0) / length;

    // Calculate RSI
    const rs = avgLoss === 0 ? 0 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return rsi;
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
