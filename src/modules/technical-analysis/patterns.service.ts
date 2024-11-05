import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticker } from '../../database/entities/ticker';

@Injectable()
export class PatternsService {
    constructor(
        @InjectRepository(Ticker)
        readonly tickerRepository: Repository<Ticker>
    ) { }

    async isPotentialBreak(closings: number[]): Promise<boolean> {
        const peaks = this.findMaxPeaks(closings);
        const [lastPrice] = closings.slice(-1);

        const isOverTrendLine = this.isCurrentPriceOverTrendLine(peaks, lastPrice);
        const isOverLastPeak = this.isCurrentPriceOverLastPeak(peaks, lastPrice);

        return isOverTrendLine && isOverLastPeak;
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

    isCurrentPriceOverLastPeak(peaks: number[], lastPrice: number): boolean {
        const peakCount = peaks.length;
        let result = false;

        if (peakCount > 0) {
            const lastPeak = peaks.at(-1);
            result = lastPeak !== undefined && lastPrice >= lastPeak;
        }

        return result
    }

    isCurrentPriceOverTrendLine(peaks: number[], lastPrice: number): boolean {
        const nextPeak = this.calculateNextPointInTendencyLine(peaks);
        return lastPrice > nextPeak;
    }

    calculateNextPointInTendencyLine(peaks: number[]): number {
        const [penultimatePeak, lastPeak] = peaks.slice(-2);
        const slope = penultimatePeak - lastPeak

        return lastPeak - slope;
    }

}
