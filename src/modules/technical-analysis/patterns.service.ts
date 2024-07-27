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

        return this.isCurrentPriceOverLastPeak(peaks, lastPrice);
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
        const { length: peakCount } = peaks;

        let result = false;

        if (peakCount > 1) {
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

    isCurrentPriceOverTrendLine(peaks: number[], lastPrice: number): boolean {
        const nextPeak = this.calculateNextPointInTendencyLine(peaks);

        return lastPrice > nextPeak;
    }

    calculateNextPointInTendencyLine(peaks: number[]): number {
        const [penultimatePeak, lastPeak] = peaks.slice(-2);
        const peakSlope = (penultimatePeak - lastPeak)

        return lastPeak - peakSlope;
    }
}
