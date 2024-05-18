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

    async isPotentialDivergence(): Promise<IPotentialTendencyChange> {
        const tickers = await this.getLastPrices(1, 90);
        const groupedTickers = this.groupTickersByMinute(tickers);
        const closingPrices = this.getClosingPrices(groupedTickers);

        const result = {
            bullish: false,
            bearish: false,
        }

        result.bullish = this.isPotentialBullishDivergence(closingPrices);

        if (!result.bullish) {
            result.bearish = this.isPotentialBearishDivergence(closingPrices);
        }

        return result
    }

    isPotentialBullishDivergence(closingPrices: number[]): boolean {
        const maxPeaks = this.findMaxPeaks(closingPrices);
        const { length: peakCount } = maxPeaks;

        let result = false;

        if (peakCount > 0) {
            const [lastPrice] = closingPrices.slice(-1);
            const maxPeak = Math.max(...maxPeaks);

            result = lastPrice >= maxPeak;
        }

        return result
    }

    isPotentialBearishDivergence(closingPrices: number[]): boolean {
        const minPeaks = this.findMinPeaks(closingPrices);
        const { length: peakCount } = minPeaks;

        let result = false;

        if (peakCount > 0) {
            const [lastPrice] = closingPrices.slice(-1);
            const minPeak = Math.min(...minPeaks);

            result = lastPrice <= minPeak;
        }

        return result
    }

    findMaxPeaks(prices: number[]): number[] {
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

    findMinPeaks(prices: number[]): number[] {
        if (prices.length < 3) {
            return [];
        }

        let minPeaks: number[] = [];

        for (let i = 1; i < prices.length - 1; i++) {
            if (prices[i] < prices[i - 1] && prices[i] < prices[i + 1]) {
                minPeaks.push(prices[i]);
            }
        }

        return minPeaks;
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
