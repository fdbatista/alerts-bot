import { Injectable } from '@nestjs/common';
import { RSI_CONFIG } from './_config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Ticker } from '../../database/entities/ticker';
import { Candle, MINUTES_TO_ANALYZE, TICKERS_PER_MINUTE, TechnicalAnalyzerAbstract } from './technical-analyzer.abstract';

import { stoch } from 'indicatorts';

type Stoch = {
    K: number;
    D: number;
};

const STOCH_CONFIG = { kPeriod: 14, dPeriod: 3 };

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

    async stoch(assetId: number, candlestickDuration: number): Promise<Stoch[]> {
        const tickerCount = MINUTES_TO_ANALYZE * TICKERS_PER_MINUTE * candlestickDuration;
        const tickers = await this.getLastTickers(assetId, tickerCount);

        const candlesticks = this.buildCandlesticks(tickers, candlestickDuration);

        return this.calculateStoch(candlesticks);
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

    calculateStoch(candles: Candle[]): Stoch[] {
        const highs = candles.map(c => c.high);
        const lows = candles.map(c => c.low);
        const closings = candles.map(c => c.close);

        const { k, d } = stoch(highs, lows, closings, STOCH_CONFIG);

        return k.map((v, i) => ({ K: v, D: d[i] }));
    }
}
