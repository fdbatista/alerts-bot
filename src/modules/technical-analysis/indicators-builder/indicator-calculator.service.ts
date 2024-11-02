import { Injectable } from '@nestjs/common';
import { CandlestickDTO } from 'src/modules/_common/dto/ticker-dto';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { rsi, stoch, ema, sma } from 'indicatorts';
import { MovingAverageDTO } from '../dto/moving-average.dto';

@Injectable()
export class IndicatorService {
  constructor(
    private readonly tickerService: TickerService,
  ) { }

  async calculateIndicators(assetId: number, intervals: number[], smaLengths: number[], emaLengths: number[]): Promise<any[]> {
    const results = [];

    for (const interval of intervals) {
      const candlesticks = await this.tickerService.generateCandlesticks(assetId, interval, 200);
      const { highs, lows, closings } = this.getHighsLowsAndClosings(candlesticks);

      const rsiResult = rsi(closings, { period: 14 });
      const stochResult = stoch(highs, lows, closings, { dPeriod: 14, kPeriod: 3 });
      const smaResult = this.calculateSMA(closings, smaLengths);
      const emaResult = this.calculateEMA(closings, emaLengths);
      
      results.push({
        interval,
        candlesticks,
        rsi: rsiResult,
        stoch: {
          k: stochResult.k,
          d: stochResult.d,
        },
        sma: smaResult,
        ema: emaResult,
      });
    }

    return results;
  }

  private getHighsLowsAndClosings(candlesticks: CandlestickDTO[]) {
    const closings: number[] = [];
    const highs: number[] = [];
    const lows: number[] = [];

    for (const candlestick of candlesticks) {
      highs.push(candlestick.high);
      lows.push(candlestick.low);
      closings.push(candlestick.close);
    }

    return { highs, lows, closings };
  }

  private calculateSMA(closings: number[], lengths: number[]): MovingAverageDTO[] {
    const smaResult = [];

    for (const length of lengths) {
      const smaLengthResult: number[] = sma(closings, { period: length })

      smaResult.push({
        length,
        name: `SMA${length}`,
        values: smaLengthResult,
      });
    }

    return smaResult;
  }

  private calculateEMA(closings: number[], lengths: number[]): MovingAverageDTO[] {
    const emaResult = [];

    for (const length of lengths) {
      const emaLengthResult: number[] = ema(closings, { period: length })

      emaResult.push({
        length,
        name: `EMA${length}`,
        values: emaLengthResult,
      });
    }

    return emaResult;
  }
}
