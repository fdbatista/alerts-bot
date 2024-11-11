import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticker } from '../../database/entities/ticker';
import { MovingAverageDTO } from './dto/moving-average.dto';
import { PotentialEntrypoint, PotentialEntrypointType } from './dto/potential-entrypoint.dto';

const CROSSOVER_OR_BOUNCE_THRESHOLD = 0.01;

@Injectable()
export class PatternsService {
    constructor(
        @InjectRepository(Ticker)
        readonly tickerRepository: Repository<Ticker>
    ) { }

    detectPotentialEntrypoints(closings: number[], sma: MovingAverageDTO[]): PotentialEntrypoint[] {
        const lastClosings = closings.slice(-10);

        const result = this.detectBounceNearSMAs(lastClosings, sma);
        const potentialBreak = this.detectPotentialBreak(lastClosings);

        if (potentialBreak.type !== PotentialEntrypointType.NONE) {
            result.push(potentialBreak);
        }

        return result;
    }

    private detectBounceNearSMAs(prices: number[], smas: MovingAverageDTO[]): PotentialEntrypoint[] {
        const result: PotentialEntrypoint[] = [];
        const relevantSMAs = smas.filter(sma => sma.length !== 10);

        for (const sma of relevantSMAs) {
            const { values, name } = sma;
            
            const lastValues = values.slice(-10);
            const potentialBounce = this.detectBounceNearSMA(name, prices, lastValues);

            if (potentialBounce.type !== PotentialEntrypointType.NONE) {
                result.push(potentialBounce);
            }
        }

        return result;
    }

    private detectBounceNearSMA(smaType: string, prices: number[], smaValues: number[], threshold = CROSSOVER_OR_BOUNCE_THRESHOLD): PotentialEntrypoint {
        let isNearSMA = false;

        for (let i = 1; i < prices.length; i++) {
            const price = prices[i];
            const smaValue = smaValues[i];
            const smaThreshold = smaValue * threshold;

            const priceDiff = Math.abs(price - smaValue);

            if (priceDiff <= smaThreshold) {
                isNearSMA = true;
            }

            if (isNearSMA && price > smaValue + smaThreshold) {
                return {
                    type: `${PotentialEntrypointType.BOUNCE} near ${smaType}`,
                    context: { price, sma: smaValue },
                };
            }
        }

        return {
            type: PotentialEntrypointType.NONE,
            context: {},
        };
    }

    private detectPotentialBreak(closings: number[]): PotentialEntrypoint {
        const peaks = this.findMaxPeaks(closings);
        const lastPrice = closings.at(-1);

        const isOverTrendLine = this.isCurrentPriceOverTrendLine(peaks, lastPrice);
        const isOverLastPeak = this.isCurrentPriceOverLastPeak(peaks, lastPrice);

        if (isOverTrendLine && isOverLastPeak) {
            return {
                type: PotentialEntrypointType.BREAK,
                context: { previousPeak: peaks.at(-1), lastPrice },
            };
        }

        return {
            type: PotentialEntrypointType.NONE,
            context: {},
        };
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

    private isCurrentPriceOverLastPeak(peaks: number[], lastPrice: number | undefined): boolean {
        const peakCount = peaks.length;
        let result = false;

        if (peakCount > 0) {
            const lastPeak = peaks.at(-1);
            result = (lastPeak !== undefined && lastPrice !== undefined && lastPrice >= lastPeak);
        }

        return result
    }

    private isCurrentPriceOverTrendLine(peaks: number[], lastPrice: number | undefined): boolean {
        const nextPeak = this.calculateNextPointInTendencyLine(peaks);
        return lastPrice !== undefined && lastPrice > nextPeak;
    }

    private calculateNextPointInTendencyLine(peaks: number[]): number {
        const [penultimatePeak, lastPeak] = peaks.slice(-2);
        const slope = penultimatePeak - lastPeak

        return lastPeak - slope;
    }

}
