import { Injectable } from '@nestjs/common';

import { IndicatorsService } from './indicators.service';
import { PatternsService } from './patterns.service';
import { TickerService } from '../ticker/ticker.service';

export interface PotentialEntrypoint {
    isPotentialBreak: boolean;
    isGoodRsiSignal: boolean;
}

const TESLA_ID = 4;
const NASDAQ_ID = 5;

@Injectable()
export class EntrypointDetectorService {
    constructor(
        private readonly tickerService: TickerService,
        private readonly patternsService: PatternsService,
        private readonly indicatorService: IndicatorsService,
    ) { }

    async isPotentialGoodEntrypoint(): Promise<PotentialEntrypoint> {
        const stockOneMinuteClosings = await this.getClosings(TESLA_ID, 1);
        const isPotentialBreak = await this.patternsService.isPotentialBreak(stockOneMinuteClosings);

        const assetFiveMinuteClosings = await this.getClosings(TESLA_ID, 5);
        const assetRSI = this.indicatorService.rsi(assetFiveMinuteClosings);
        const [assetLastRSI] = assetRSI.slice(-1);

        const nasdaqOneMinuteClosings = await this.getClosings(NASDAQ_ID, 1);
        const nasdaqRSI = this.indicatorService.rsi(nasdaqOneMinuteClosings);
        const [nasdaqLastRSI] = nasdaqRSI.slice(-1);

        const isGoodRsiSignal = assetLastRSI <= 35 && nasdaqLastRSI <= 35;

        return { isPotentialBreak, isGoodRsiSignal };
    }

    async getClosings(assetId: number, candleDuration: number): Promise<number[]> {
        const tickers = await this.tickerService.getTickers(assetId, candleDuration);

        return tickers.map(ticker => ticker.close);
    }
}
