import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as _ from 'lodash';

import { Ticker } from '../../database/entities/ticker';
import { LoggerUtil } from 'src/utils/logger.util';

export type Candle = {
    startTime: string;
    open: number;
    close: number;
    high: number;
    low: number;
};

export const MINUTES_TO_ANALYZE = 30;
export const TICKERS_PER_MINUTE = 3;

@Injectable()
export abstract class TechnicalAnalyzerAbstract {
    constructor(
        @InjectRepository(Ticker)
        protected readonly tickerRepository: Repository<Ticker>
    ) { }

    protected async getLastTickers(assetId: number, count: number): Promise<Ticker[]> {
        const result = await this.tickerRepository.find({
            where: { assetId },
            order: { timestamp: 'desc' },
            take: count,
        });

        return result.reverse();
    }

    protected buildCandlesticks(tickerData: Ticker[], intervalMinutes: number): Candle[] {
        const candles: Candle[] = [];
        let currentCandle: Candle | null = null;

        for (const data of tickerData) {
            const { timestamp: date, open, high, low, close } = data;
            const intervalStart = Math.floor(date.getTime() / (intervalMinutes * 60 * 1000)) * (intervalMinutes * 60 * 1000);
            const startTime = new Date(intervalStart).toISOString();

            if (!currentCandle || startTime !== currentCandle.startTime) {
                if (currentCandle) {
                    candles.push(currentCandle);
                }

                currentCandle = { startTime, open, high, low, close };
            } else {
                currentCandle.high = Math.max(currentCandle.high, high);
                currentCandle.low = Math.min(currentCandle.low, low);
                currentCandle.close = close;
            }
        }

        if (currentCandle) {
            candles.push(currentCandle);
        }

        return candles;
    }

    public async getClosingPrices(assetId: number, candlestickDuration: number): Promise<number[]> {
        const tickerCount = MINUTES_TO_ANALYZE * TICKERS_PER_MINUTE * candlestickDuration;
        LoggerUtil.log(`Taking ${tickerCount} tickers for analysis`);

        const tickers = await this.getLastTickers(assetId, tickerCount);
        const candlesticks = this.buildCandlesticks(tickers, candlestickDuration);

        return candlesticks.map((candle: Candle) => candle.close);
    }
}
