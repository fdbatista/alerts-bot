import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticker } from '../../database/entities/ticker';
import { MovingAverageDTO } from './dto/moving-average.dto';
import { PotentialEntrypoint, PotentialEntrypointType } from './dto/potential-entrypoint.dto';

const CROSSOVER_OR_BOUNCE_THRESHOLD = 0.0015;

@Injectable()
export class PatternsService {
    constructor(
        @InjectRepository(Ticker)
        readonly tickerRepository: Repository<Ticker>
    ) { }

    detectPotentialEntrypoints(closings: number[], sma: MovingAverageDTO[]): PotentialEntrypoint[] {
        const lastClosings = closings.slice(-10);

        const entrypoints = this.detectBounceNearSMAs(lastClosings, sma);
        const potentialBreak = this.detectPotentialBreak(lastClosings);

        if (potentialBreak.type !== PotentialEntrypointType.NONE) {
            entrypoints.push(potentialBreak);
        }

        const crossovers = this.detectBullishCrossovers(sma);
        entrypoints.push(...crossovers);

        return entrypoints;
    }

    private detectBounceNearSMAs(prices: number[], smas: MovingAverageDTO[]): PotentialEntrypoint[] {
        const result: PotentialEntrypoint[] = [];

        const sma200 = smas.filter(sma => sma.length === 200);
        const isBullishTrend = this.isCurrentPriceOverSma200(prices, sma200);

        if (isBullishTrend) {
            const relevantSMAs = smas.filter(sma => sma.length !== 10);

            for (const sma of relevantSMAs) {
                const { values, name } = sma;

                const lastValues = values.slice(-10);
                const potentialBounce = this.detectBounceNearSMA(name, prices, lastValues);

                if (potentialBounce.type !== PotentialEntrypointType.NONE) {
                    result.push(potentialBounce);
                }
            }
        }

        return result;
    }

    private isCurrentPriceOverSma200(prices: number[], sma: MovingAverageDTO[]): boolean {
        const lastPrice = prices.at(-1) as number;
        const sma200 = sma.find(sma => sma.length === 200)?.values.at(-1) as number;

        return lastPrice > sma200;
    }

    private detectBullishCrossovers(sma: MovingAverageDTO[]): PotentialEntrypoint[] {
        const result = [];

        const smaOrderedByLength = sma.sort((a, b) => a.length - b.length);
        const smaTypes = sma.length;

        for (let i = 0; i < smaTypes - 1; i++) {
            const lowLengthSma = smaOrderedByLength[i].values;

            const lowLengthSmaLastValue = lowLengthSma.at(-1) as number;
            const lowLengthSmaPenultimateValue = lowLengthSma.at(-2) as number;

            for (let j = i + 1; j < smaTypes; j++) {
                const highLengthSma = smaOrderedByLength[j].values;

                const highLengthSmaLastValue = highLengthSma.at(-1) as number;
                const highLengthSmaPenultimateValue = highLengthSma.at(-2) as number;

                if (lowLengthSmaPenultimateValue < highLengthSmaPenultimateValue && lowLengthSmaLastValue > highLengthSmaLastValue) {
                    result.push({
                        type: PotentialEntrypointType.GOLDEN_CROSS,
                        context: `${sma[i].name} crossover ${sma[j].name}`,
                    });
                }
            }
        }

        return result;
    }

    private detectBounceNearSMA(smaType: string, prices: number[], smaValues: number[], threshold = CROSSOVER_OR_BOUNCE_THRESHOLD): PotentialEntrypoint {
        let isNearSMA = false;
        let priceNearSMA = 0;

        for (let i = 1; i < prices.length; i++) {
            const price = prices[i];
            const smaValue = smaValues[i];
            const smaThreshold = smaValue * threshold;

            const priceDiff = Math.abs(price - smaValue);

            if (priceDiff <= smaThreshold) {
                isNearSMA = true;
                priceNearSMA = price
            }

            if (isNearSMA && price > smaValue + smaThreshold && price > priceNearSMA) {
                return {
                    type: `${PotentialEntrypointType.BOUNCE} near ${smaType}`,
                    context: { index: i, price, sma: smaValue },
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
        const lastPrice = closings.at(-1) as number;

        const isOverLastPeak = this.isCurrentPriceOverLastPeak(peaks, lastPrice);
        const isOverTrendLine = this.isCurrentPriceOverTrendLine(peaks, lastPrice);

        if (isOverLastPeak && isOverTrendLine) {
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

    private isCurrentPriceOverLastPeak(peaks: number[], lastPrice: number): boolean {
        const { length: peakCount } = peaks;

        let result = false;

        if (peakCount > 1 && this.isDescending(peaks)) {
            const [lastPeak] = peaks.slice(-1);
            result = lastPrice >= lastPeak;
        }

        return result
    }
    
    private isDescending(peaks: number[]): boolean {
        for (let i = 0; i < peaks.length - 1; i++) {
            if (peaks[i] < peaks[i + 1]) {
                return false;
            }
        }
        return true;
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
