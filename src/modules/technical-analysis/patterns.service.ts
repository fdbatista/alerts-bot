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
        const closingPrices = await this.getClosingPrices(5);

        const peaks = this.findMaxPeaks(closingPrices);
        const [lastPrice] = closingPrices.slice(-1);

        return this.isPotentialBullishDivergence(peaks, lastPrice);
    }

    private isPotentialBullishDivergence(peaks: number[], lastPrice: number): boolean {
        const { length: peakCount } = peaks;

        let result = false;

        if (peakCount > 0 && this.isDescending(peaks)) {
            const maxPeak = Math.max(...peaks);

            result = lastPrice >= maxPeak;
        }

        return result
    }

    isPotentialShoulderHeadShoulder(peaks: number[], lastPrice: number): boolean {
        const lastPeaks = peaks.slice(-3)
        const { length: peakCount } = lastPeaks;

        let result = false;

        if (peakCount > 0) {
            if (peakCount === 2) {
                const minPeak = Math.min(...peaks);
                result = lastPrice <= minPeak;
            } else {
                const [firstPeak, secondPeak, thirdPeak] = lastPeaks;
                result = secondPeak > firstPeak && secondPeak > thirdPeak && lastPrice <= thirdPeak
            }
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
}
