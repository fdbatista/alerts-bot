import { Injectable } from '@nestjs/common';
import { rsi } from 'indicatorts';
import { RSI_CONFIG } from './_config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as _ from 'lodash';

import { Ticker } from '../../database/entities/ticker';
import { DateUtil } from '../../utils/date.util';

@Injectable()
export class IndicatorsService {
    constructor(
        @InjectRepository(Ticker)
        private readonly tickerRepository: Repository<Ticker>
    ) { }

    async getPriceBreak(): Promise<boolean> {
        const tickers = await this.getLastPrices(1, 120);
        const groupedTickers = this.groupTickersByMinute(tickers);
        const closingPrices = this.getClosingPrices(groupedTickers);

        const [lastPrice] = closingPrices.slice(-1);
        const recentMaxPeaks = this.findTwoMaxPeaks(closingPrices);

        for (const peak of recentMaxPeaks) {
            if (lastPrice <= peak) {
                return false;
            }
        }

        return true;
    }

    findTwoMaxPeaks(prices: number[]): number[] {
        if (prices.length < 3) {
            throw new Error("Array must contain at least 3 elements to have a peak.");
        }
    
        // Find all peaks
        let peaks: { value: number, index: number }[] = [];
        for (let i = 1; i < prices.length - 1; i++) {
            if (prices[i] > prices[i - 1] && prices[i] > prices[i + 1]) {
                peaks.push({ value: prices[i], index: i });
            }
        }
    
        // Sort peaks by value in descending order
        peaks.sort((a, b) => b.value - a.value);
    
        // Get the top two peaks
        const topPeaks = peaks.slice(0, 2).map(peak => peak.value);
    
        // If less than 2 peaks found, fill with -Infinity
        while (topPeaks.length < 2) {
            topPeaks.push(-Infinity);
        }
    
        return topPeaks;
    }

    async getRSI(): Promise<number[]> {
        const tickers = await this.getLastPrices(1, 720);
        const groupedTickers = this.groupTickersByMinute(tickers);
        const closingPrices = this.getClosingPrices(groupedTickers);

        return rsi(closingPrices, RSI_CONFIG);
    }

    async getLastPrices(bookId: number, count: number): Promise<Ticker[]> {
        const result = await this.tickerRepository.find({
            select: ['last', 'timestamp'],
            where: { bookId },
            order: { timestamp: 'desc' },
            take: count,
        });

        return result.reverse();
    }

    groupTickersByMinute(tickers: Ticker[]): _.Dictionary<Ticker[]> {
        return _.groupBy(tickers, (ticker) => {
            const { timestamp } = ticker

            return DateUtil.formatDateUntilMinutes(timestamp);
        })
    }

    getClosingPrices(groupedTickers: _.Dictionary<Ticker[]>): number[] {
        return Object.entries(groupedTickers).map(([, tickers]) => {
            const lastItem = _.last(tickers)
            return lastItem?.last ?? 0
        }).filter(item => item > 0)

    }
}
