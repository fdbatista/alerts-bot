import { Injectable } from '@nestjs/common';

@Injectable()
export class TrendAnalysisService {
    // Detect bearish trend and potential trend change
    analyzeBearishTrend(closingPrices: number[]): boolean {
        const peaks = this.findPeaks(closingPrices);

        if (peaks.length < 2) {
            return false;
        }

        const bearish = this.arePeaksDescending(peaks);
        const priceOverTrendline = this.detectTrendlineCross(closingPrices);
        const priceOverLastPeak = this.isCurrentPriceOverLastPeak(peaks, closingPrices.at(-1) as number);

        return bearish && priceOverTrendline && priceOverLastPeak;
    }

    // Detect SMA crossovers
    detectSMACrossovers(data: number[]): { sma50Cross: boolean; sma200Cross: boolean } {
        const sma10 = this.calculateSMA(data, 10);
        const sma50 = this.calculateSMA(data, 50);
        const sma200 = this.calculateSMA(data, 200);

        const sma50Cross = this.checkCrossover(sma10, sma50);
        const sma200Cross = this.checkCrossover(sma10, sma200);

        return { sma50Cross, sma200Cross };
    }

    // Helper to calculate SMA
    private calculateSMA(data: number[], period: number): number[] {
        const sma: number[] = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                sma.push(0); // Insufficient data for SMA calculation
            } else {
                const slice = data.slice(i - period + 1, i + 1);
                sma.push(slice.reduce((acc, curr) => acc + curr, 0) / period);
            }
        }
        return sma;
    }

    // Helper to find peaks in price data
    private findPeaks(data: number[]): number[] {
        const peaks: number[] = [];

        for (let i = 1; i < data.length - 1; i++) {
            if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
                peaks.push(data[i]);
            }
        }

        return peaks;
    }

    private arePeaksDescending(peaks: number[]): boolean {
        for (let i = 0; i < peaks.length - 1; i++) {
            if (peaks[i] < peaks[i + 1]) {
                return false;
            }
        }
        return true;
    }

    // Helper to detect trendline crossing
    private detectTrendlineCross(closingPrices: number[]): boolean {
        const trendline = this.calculateTrendline(closingPrices);

        const lastPrice = closingPrices.at(-1) as number;
        const lastTrendPoint = trendline.at(-1) as number;

        return lastPrice > lastTrendPoint;
    }

    // Helper to calculate a trendline (basic linear regression approximation)
    private calculateTrendline(data: number[]): number[] {
        const x = data.map((_, i) => i);
        const n = data.length;

        const sumX = x.reduce((acc, val) => acc + val, 0);
        const sumY = data.reduce((acc, val) => acc + val, 0);
        const sumXY = x.reduce((acc, val, i) => acc + val * data[i], 0);
        const sumX2 = x.reduce((acc, val) => acc + val * val, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return x.map((val) => slope * val + intercept);
    }

    // Helper to check if a new peak is higher than the previous one
    private isCurrentPriceOverLastPeak(peaks: number[], lastPrice: number): boolean {
        if (peaks.length === 0) {
            return false;
        }

        const lastPeak = peaks.at(-1) as number;
        return lastPrice > lastPeak;
    }

    // Helper to detect crossover between two SMAs
    private checkCrossover(smaShort: number[], smaLong: number[]): boolean {
        if (smaShort.length < 2 || smaLong.length < 2) {
            return false;
        }

        const lastShort = smaShort.at(-1) as number;
        const lastLong = smaLong.at(-1) as number;

        const prevShort = smaShort.at(-2) as number;
        const prevLong = smaLong.at(-2) as number;

        return prevShort < prevLong && lastShort > lastLong;
    }
}
