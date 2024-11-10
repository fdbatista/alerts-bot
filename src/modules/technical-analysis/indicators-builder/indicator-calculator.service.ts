import { Injectable } from '@nestjs/common';
import { CandlestickDTO } from 'src/modules/_common/dto/ticker-dto';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { rsi, stoch, ema, sma } from 'indicatorts';
import { MovingAverageDTO } from '../dto/moving-average.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { BUILD_INDICATORS, RUN_TECHNICAL_ANALYSIS } from './config';

import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AssetDTO } from 'src/modules/ticker/dto/asset.dto';
import { IndicatorsDTO } from '../dto/indicators.dto';

const intervals = [1, 5, 30, 60, 1440]
const smaLengths = [10, 50, 200];
const emaLengths = [45, 200];

@Injectable()
export class IndicatorCalculatorService {
  constructor(
    private readonly tickerService: TickerService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  @OnEvent(BUILD_INDICATORS, { async: true })
  async processIndicators(assets: AssetDTO[]) {
    from(assets)
      .pipe(mergeMap(asset => this.detectPotentialEntrypoints(asset)))
      .subscribe(() => { });
  }

  async detectPotentialEntrypoints(asset: AssetDTO): Promise<void> {
    const indicators = await this.calculateIndicators(asset.id);
    this.eventEmitter.emit(RUN_TECHNICAL_ANALYSIS, asset, indicators);
  }

  async calculateIndicators(assetId: number): Promise<IndicatorsDTO[]> {
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
        closings,
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
