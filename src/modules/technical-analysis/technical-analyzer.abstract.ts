import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as _ from 'lodash';

import { Ticker } from '../../database/entities/ticker';

export type Candle = {
    startTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
};

@Injectable()
export abstract class TechnicalAnalyzerAbstract {
    constructor(
        @InjectRepository(Ticker)
        protected readonly tickerRepository: Repository<Ticker>
    ) { }

    protected async getLastPrices(): Promise<Ticker[]> {
        const result = await this.tickerRepository.find({
            select: ['last', 'timestamp'],
            where: { bookId: 1 },
            order: { timestamp: 'desc' },
            take: 720,
        });

        return result.reverse();
    }

    buildCandlesticks(priceData: Ticker[], intervalMinutes: number): Candle[] {
        const candles: Candle[] = [];
        let currentCandle: Candle | null = null;

        for (const data of priceData) {
            const date = new Date(data.timestamp);
            const intervalStart = Math.floor(date.getTime() / (intervalMinutes * 60 * 1000)) * (intervalMinutes * 60 * 1000);
            const candleStartTime = Math.floor(intervalStart / 1000);

            if (!currentCandle || candleStartTime !== currentCandle.startTime) {
                if (currentCandle) {
                    candles.push(currentCandle);
                }
                currentCandle = {
                    startTime: candleStartTime,
                    open: data.last,
                    high: data.last,
                    low: data.last,
                    close: data.last,
                };
            } else {
                currentCandle.high = Math.max(currentCandle.high, data.last);
                currentCandle.low = Math.min(currentCandle.low, data.last);
                currentCandle.close = data.last;
            }
        }

        if (currentCandle) {
            candles.push(currentCandle);
        }

        return candles;
    }

    protected async getClosingPrices(candlestickDuration: number): Promise<number[]> {
        const tickers = await this.getLastPrices();
        const candlesticks = this.buildCandlesticks(tickers, candlestickDuration);

        return candlesticks.map((candle: Candle) => candle.close);
    }
}
