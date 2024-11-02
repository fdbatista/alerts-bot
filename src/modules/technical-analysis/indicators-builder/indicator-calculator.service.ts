import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ticker } from 'src/database/entities/ticker';
import { rsi, stoch, ema, sma } from 'indicatorts';
import { CandlestickDTO } from 'src/modules/_common/dto/ticker-dto';

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
      const { highs, lows, closings } = this.orderHighsLowsAndClosingsByTimeDesc(candlesticks);

      const rsiResult = rsi(closings, { period: 14 });
      const stockResult = stoch(highs, lows, closings, { dPeriod: 14, kPeriod: 3 });
      const emaResult = ema(closings, { period: 45 });

      const smaResult = [];

      for (const length of smaLengths) {
        const smaLengthResult = sma(closings, { period: length })

        smaResult.push({
          length,
          sma: smaLengthResult.at(-1),
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

  async generateCandlesticks(assetId: number, interval: number, length: number): Promise<CandlestickDTO[]> {
    const query = CANDLESTICKS_QUERY
      .replaceAll(':minutes', interval.toString())
      .replaceAll(':length', `${interval * length}`);

    return this.stockPriceRepository.query(query, [assetId]);
  }

  private orderHighsLowsAndClosingsByTimeDesc(candlesticks: CandlestickDTO[]) {
    const closings: number[] = [];
    const highs: number[] = [];
    const lows: number[] = [];

    const lastIndex = candlesticks.length - 1;

    for (let i = lastIndex; i >= 0; i--) {
      const ticker = candlesticks[i];

      highs.push(ticker.high);
      lows.push(ticker.low);
      closings.push(ticker.close);
    }

    return { highs, lows, closings };
  }
}
