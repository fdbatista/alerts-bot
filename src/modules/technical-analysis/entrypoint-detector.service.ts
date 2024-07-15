import { Injectable } from '@nestjs/common';

import { IndicatorsService } from './indicators.service';
import { PatternsService } from './patterns.service';
import { TickerService } from '../ticker/ticker.service';

export interface PotentialEntrypoint {
    isPotentialBreak: boolean;
    isGoodRsiSignal: boolean;
}

const NASDAQ_ID = 5;

const RSI_ENTRYPOINT_THRESHOLD = 35;

@Injectable()
export class EntrypointDetectorService {
    constructor(
        private readonly tickerService: TickerService,
        private readonly patternsService: PatternsService,
        private readonly indicatorService: IndicatorsService,
    ) { }

    async isPotentialGoodEntrypoint(assetId: number): Promise<PotentialEntrypoint> {
        const assetClosingsInOneMinute = await this.getClosings(assetId, 1);
        const isPotentialBreak = await this.patternsService.isPotentialBreak(assetClosingsInOneMinute);

        const assetRsiInOneMinute = await this.calculateRsi(assetId, 5);
        const nasdaqRsiInFiveMinutes = await this.calculateRsi(NASDAQ_ID, 1);

        const isGoodRsiSignal = assetRsiInOneMinute <= RSI_ENTRYPOINT_THRESHOLD && nasdaqRsiInFiveMinutes <= RSI_ENTRYPOINT_THRESHOLD;

        return { isPotentialBreak, isGoodRsiSignal };
    }

    private async calculateRsi(assetId: number, candleDuration: number): Promise<number> {
        const closings = await this.getClosings(assetId, candleDuration);
        const rsi = this.indicatorService.rsi(closings);
        const [lastRsi] = rsi.slice(-1);

        return lastRsi;
    }

    async getClosings(assetId: number, candleDuration: number): Promise<number[]> {
        const tickers = await this.tickerService.getTickers(assetId, candleDuration);

        return tickers.map(ticker => ticker.close);
    }
}
