import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as _ from 'lodash';

import { Ticker } from '../../database/entities/ticker';
import { LoggerUtil } from 'src/utils/logger.util';

export type Candle = {
    startTime: string;
    open: number;
    high: number;
    low: number;
    close: number;
};

export const MINUTES_TO_ANALYZE = 30;
export const TICKERS_PER_MINUTE = 3;

@Injectable()
export abstract class TechnicalAnalyzerAbstract {
    constructor(
        @InjectRepository(Ticker)
        protected readonly tickerRepository: Repository<Ticker>
    ) { }

    protected async getLastTickers(count: number): Promise<Ticker[]> {
        const result = await this.tickerRepository.find({
            where: { bookId: 1 },
            order: { timestamp: 'desc' },
            take: count,
        });

        return result.reverse();
    }

    protected buildCandlesticks(tickerData: Ticker[], intervalMinutes: number): Candle[] {
        const candles: Candle[] = [];
        let currentCandle: Candle | null = null;

        for (const data of tickerData) {
            const { timestamp: date, ask } = data;
            const intervalStart = Math.floor(date.getTime() / (intervalMinutes * 60 * 1000)) * (intervalMinutes * 60 * 1000);
            const candleStartTime = new Date(intervalStart).toISOString();

            if (!currentCandle || candleStartTime !== currentCandle.startTime) {
                if (currentCandle) {
                    candles.push(currentCandle);
                }

                currentCandle = {
                    startTime: candleStartTime,
                    open: ask,
                    high: ask,
                    low: ask,
                    close: ask,
                };
            } else {
                currentCandle.high = Math.max(currentCandle.high, ask);
                currentCandle.low = Math.min(currentCandle.low, ask);
                currentCandle.close = ask;
            }
        }

        if (currentCandle) {
            candles.push(currentCandle);
        }

        return candles;
    }

    public async getClosingPrices(candlestickDuration: number): Promise<number[]> {
        const tickerCount = MINUTES_TO_ANALYZE * TICKERS_PER_MINUTE * candlestickDuration;
        LoggerUtil.log(`Taking ${tickerCount} tickers for analysis`);

        const tickers = await this.getLastTickers(tickerCount);
        const candlesticks = this.buildCandlesticks(tickers, candlestickDuration);

        return candlesticks.map((candle: Candle) => candle.close);
    }
}
