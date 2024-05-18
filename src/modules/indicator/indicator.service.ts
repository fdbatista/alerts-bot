import { Injectable } from '@nestjs/common';
import { rsi } from 'indicatorts';
import { RSI_CONFIG } from './_config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as _ from 'lodash';

import { Ticker } from '../../database/entities/ticker';
import { DateUtil } from '../../utils/date.util';

export interface IPotentialTendencyChange {
    bullish: boolean
    bearish: boolean
}

@Injectable()
export class IndicatorsService {
    constructor(
        @InjectRepository(Ticker)
        private readonly tickerRepository: Repository<Ticker>
    ) { }

    async getRSI(): Promise<number[]> {
        const tickers = await this.getLastPrices(1, 720);
        const groupedTickers = this.groupTickersByMinute(tickers);
        const closingPrices = this.getClosingPrices(groupedTickers);

        return rsi(closingPrices, RSI_CONFIG);
    }

    async isPotentialDivergence(): Promise<IPotentialTendencyChange> {
        const tickers = await this.getLastPrices(1, 90);
        const groupedTickers = this.groupTickersByMinute(tickers);
        const closingPrices = this.getClosingPrices(groupedTickers);

        const peaks = this.findMaxPeaks(closingPrices);

        const result = { bullish: false, bearish: false }
        result.bullish = this.isPotentialBullishDivergence(peaks, closingPrices);

        if (!result.bullish) {
            result.bearish = this.isPotentialBearishDivergence(peaks, closingPrices);
        }

        return result
    }

    private isPotentialBullishDivergence(peaks: number[], closingPrices: number[]): boolean {
        const { length: peakCount } = peaks;

        let result = false;

        if (peakCount > 0 && this.isDescending(peaks)) {
            const [lastPrice] = closingPrices.slice(-1);
            const maxPeak = Math.max(...peaks);

            result = lastPrice >= maxPeak;
        }

        return result
    }

    private isPotentialBearishDivergence(peaks: number[], closingPrices: number[]): boolean {
        const { length: peakCount } = peaks;

        let result = false;

        if (peakCount > 0 && this.isAscending(peaks)) {
            const [lastPrice] = closingPrices.slice(-1);
            const minPeak = Math.min(...peaks);

            result = lastPrice <= minPeak;
        }

        return result
    }

    private isDescending(arr: number[]): boolean {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] < arr[i + 1]) {
                return false;
            }
        }
        return true;
    }

    private isAscending(arr: number[]): boolean {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                return false;
            }
        }
        return true;
    }

    private findMaxPeaks(prices: number[]): number[] {
        if (prices.length < 3) {
            return [];
        }

        let peaks: number[] = [];

        for (let i = 1; i < prices.length - 1; i++) {
            if (prices[i] > prices[i - 1] && prices[i] > prices[i + 1]) {
                peaks.push(prices[i]);
            }
        }

        return peaks;
    }

    private async getLastPrices(bookId: number, count: number): Promise<Ticker[]> {
        const result = await this.tickerRepository.find({
            select: ['last', 'timestamp'],
            where: { bookId },
            order: { timestamp: 'desc' },
            take: count,
        });

        return result.reverse();
    }

    private groupTickersByMinute(tickers: Ticker[]): _.Dictionary<Ticker[]> {
        return _.groupBy(tickers, (ticker) => {
            const { timestamp } = ticker

            return DateUtil.formatDateUntilMinutes(timestamp);
        })
    }

    private getClosingPrices(groupedTickers: _.Dictionary<Ticker[]>): number[] {
        return Object.entries(groupedTickers).map(([, tickers]) => {
            const lastItem = _.last(tickers)
            return lastItem?.last ?? 0
        }).filter(item => item > 0)

    }
}
