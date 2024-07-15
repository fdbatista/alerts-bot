import { Injectable } from '@nestjs/common';

import { IndicatorsService } from './indicators.service';
import { PatternsService } from './patterns.service';
import { TickerService } from '../ticker/ticker.service';
import { LoggerUtil } from 'src/utils/logger.util';
import { Asset } from 'src/database/entities/asset';
import { AssetService } from '../asset/asset.service';

export interface PotentialEntrypoint {
    asset: Asset;
    isPotentialBreak: boolean;
    isGoodRsiSignal: boolean;
}

const NASDAQ_ID = 5;
const RSI_ENTRYPOINT_THRESHOLD = 35;

@Injectable()
export class EntrypointDetectorService {
    constructor(
        private readonly assetService: AssetService,
        private readonly tickerService: TickerService,
        private readonly patternsService: PatternsService,
        private readonly indicatorService: IndicatorsService,
    ) { }

    async detectPotentialEntrypoints(assetTypeId: number): Promise<PotentialEntrypoint[]> {
        const activeAssets = await this.assetService.getActiveAssetsByTypeId(assetTypeId);
        const nasdaqRsiInOneMinute = await this.calculateRsi(NASDAQ_ID, 1);

        const result = []

        for (const asset of activeAssets) {
            const potentialEntrypoint = await this.isPotentialGoodEntrypoint(asset, nasdaqRsiInOneMinute);
            result.push(potentialEntrypoint);
        }

        return result;
    }

    private async isPotentialGoodEntrypoint(asset: Asset, nasdaqRsiInOneMinute: number): Promise<PotentialEntrypoint> {
        LoggerUtil.log(`------ANALYZING ${asset.symbol}------`);

        const assetClosingsInOneMinute = await this.getClosings(asset.id, 1);
        const isPotentialBreak = await this.patternsService.isPotentialBreak(assetClosingsInOneMinute);

        const assetRsiInFiveMinute = await this.calculateRsi(asset.id, 5);

        const isGoodRsiSignal = assetRsiInFiveMinute <= RSI_ENTRYPOINT_THRESHOLD && nasdaqRsiInOneMinute <= RSI_ENTRYPOINT_THRESHOLD;

        const analysisResult = {
            assetRsi: assetRsiInFiveMinute,
            nasdaqRsi: nasdaqRsiInOneMinute,
            isPotentialBreak,
            isGoodRsiSignal,
        };

        LoggerUtil.log('RESULT: ', analysisResult);

        return { isPotentialBreak, isGoodRsiSignal, asset };
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
