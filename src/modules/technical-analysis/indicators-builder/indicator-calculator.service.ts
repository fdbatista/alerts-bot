import { Injectable } from '@nestjs/common';
import { CandlestickDTO } from 'src/modules/_common/dto/ticker-dto';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { rsi, stoch, ema, sma } from 'indicatorts';

@Injectable()
export class IndicatorService {
  constructor(
    private readonly tickerService: TickerService,
  ) { }

  async calculateIndicators(assetId: number, intervals: number[], smaLengths: number[]): Promise<any> {
    const results = [];

    for (const bucket of intervals) {
      const candlesticks = await this.tickerService.generateCandlesticks(assetId, bucket, 200);
      const { highs, lows, closings } = this.orderHighsLowsAndClosingsByTimeDesc(candlesticks);

      const rsiResult = rsi(closings, { period: 14 });
      const stockResult = stoch(highs, lows, closings, { dPeriod: 14, kPeriod: 3 });
      const emaResult = ema(closings, { period: 45 });

      const smaResult = [];

      for (const length of smaLengths) {
        const smaLengthResult = sma(closings, { period: length })

        smaResult.push({
          length,
          sma: smaLengthResult,
        });
      }

      results.push({
        interval: bucket,
        candlesticks,
        rsi: rsiResult,
        stoch: {
          k: stockResult.k,
          d: stockResult.d,
        },
        sma: smaResult,
        ema: emaResult,
      });
    }

    return results;
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
