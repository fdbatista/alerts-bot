import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Ticker } from '../../database/entities/ticker';
import { TechnicalAnalyzerAbstract } from './technical-analyzer.abstract';

@Injectable()
export class PatternsService extends TechnicalAnalyzerAbstract {
    constructor(
        @InjectRepository(Ticker)
        readonly tickerRepository: Repository<Ticker>
    ) {
        super(tickerRepository);
    }

    async isPotentialBreakage(): Promise<boolean> {
        const closingPrices = await this.getClosingPrices(1);

        return this.isCurrentPriceOverTrendLine(closingPrices);
    }

    isCurrentPriceOverTrendLine(closingPrices: number[]): boolean {
        const [currentPrice] = closingPrices.slice(-1);

        const peaks = this.findMaxPeaks(closingPrices);
        const nextPeak = this.calculateNextPointInTendencyLine(peaks);

        return currentPrice > nextPeak;
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

    calculateNextPointInTendencyLine(peaks: number[]): number {
        const [penultimatePeak, lastPeak] = peaks.slice(-2);
        const peakSlope = (penultimatePeak - lastPeak)
        
        return lastPeak - peakSlope;
    }

    isCurrentPriceOverLastPeak(peaks: number[], lastPrice: number): boolean {
        const { length: peakCount } = peaks;

        let result = false;

        if (peakCount > 0 && this.isDescending(peaks)) {
            const [lastPeak] = peaks.slice(-1);
            result = lastPrice >= lastPeak;
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
}
