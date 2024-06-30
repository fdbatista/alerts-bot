import { Injectable } from '@nestjs/common';
import { RSI_CONFIG } from './_config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Ticker } from '../../database/entities/ticker';
import { Candle, MINUTES_TO_ANALYZE, TICKERS_PER_MINUTE, TechnicalAnalyzerAbstract } from './technical-analyzer.abstract';

type Stoch = {
    K: number;
    D: number;
};

@Injectable()
export class IndicatorsService extends TechnicalAnalyzerAbstract {
    constructor(
        @InjectRepository(Ticker)
        tickerRepository: Repository<Ticker>
    ) {
        super(tickerRepository);
    }

    async rsi(candlestickDuration: number): Promise<number> {
        const closingPrices = await this.getClosingPrices(4, candlestickDuration);

        return this.calculateRSI(closingPrices, RSI_CONFIG.period);
    }

    async stoch(candlestickDuration: number): Promise<Stoch[]> {
        const tickerCount = MINUTES_TO_ANALYZE * TICKERS_PER_MINUTE * candlestickDuration;
        const tickers = await this.getLastTickers(4, tickerCount);
        
        const candlesticks = this.buildCandlesticks(tickers, candlestickDuration);

        return this.calculateStoch(candlesticks, RSI_CONFIG.period, 3);
    }

    private calculateRSI(prices: number[], period: number): number {
        let gains = 0;
        let losses = 0;

        for (let i = 1; i < period; i++) {
            const change = prices[i] - prices[i - 1];

            if (change > 0) {
                gains += change;
            }
            else {
                losses -= change;
            }
        }

        const relativeStrength = gains / losses;

        return 100 - 100 / (1 + relativeStrength);
    }

    calculateStoch(candles: Candle[], period: number, smoothing: number): Stoch[] {
        const result: Stoch[] = [];

        for (let i = period - 1; i < candles.length; i++) {
            const lookBackCandles = candles.slice(i - period + 1, i + 1);
            const high = Math.max(...lookBackCandles.map(c => c.high));
            const low = Math.min(...lookBackCandles.map(c => c.low));
            const currentClose = candles[i].close;

            const K = ((currentClose - low) / (high - low)) * 100;

            let D = K;

            if (i >= period + smoothing - 2) {
                const recentKs = result.slice(-smoothing).map(s => s.K);
                D = recentKs.reduce((acc, val) => acc + val, 0) / smoothing;
            }

            result.push({ K, D });
        }

        return result;
    }
}
