import { Injectable } from '@nestjs/common';

import { PatternsService } from './patterns.service';
import { TickerService } from '../ticker/ticker.service';
import { LoggerUtil } from 'src/utils/logger.util';
import { Asset } from 'src/database/entities/asset';
import { AssetService } from '../asset/asset.service';
import { RsiRepository } from './listeners/rsi.repository';
import { StochRepository } from './listeners/stoch.repository';

export interface PotentialEntrypoint {
    asset: Asset;
    isPotentialBreak: boolean;
    isGoodRsiSignal: boolean;
    isGoodStochSignal: boolean;
}

const NASDAQ_ID = 5;
const RSI_ENTRYPOINT_THRESHOLD = 35;

@Injectable()
export class EntrypointDetectorService {
    constructor(
        private readonly assetService: AssetService,
        private readonly tickerService: TickerService,
        private readonly patternsService: PatternsService,
        private readonly rsiRepository: RsiRepository,
        private readonly stochRepository: StochRepository,
    ) { }

    async detectPotentialEntrypoints(assetTypeIds: number[]): Promise<PotentialEntrypoint[]> {
        const activeAssets = await this.assetService.getActiveAssetsByTypeIds(assetTypeIds);
        
        const latestNasdaqRsi = await this.rsiRepository.getLatest(NASDAQ_ID, 1);
        const nasdaqRsiInOneMinute = latestNasdaqRsi?.value ?? 100;

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

        const lastRsi = await this.rsiRepository.getLatest(asset.id, 5);
        const assetRsiInFiveMinute = lastRsi?.value ?? 100;
        const isGoodRsiSignal = assetRsiInFiveMinute <= RSI_ENTRYPOINT_THRESHOLD && nasdaqRsiInOneMinute <= RSI_ENTRYPOINT_THRESHOLD;

        const lastStochInOneMinute = await this.stochRepository.getLatest(asset.id, 1);
        const stochInOneMinuteK = lastStochInOneMinute?.k ?? 100;
        const stochInOneMinuteD = lastStochInOneMinute?.d ?? 100;

        const lastStochInFiveMinutes = await this.stochRepository.getLatest(asset.id, 1);
        const stochInFiveMinutesK = lastStochInFiveMinutes?.k ?? 100;
        const stochInFiveMinutesD = lastStochInFiveMinutes?.d ?? 100;

        const isGoodStochSignal = stochInOneMinuteD + stochInOneMinuteK + stochInFiveMinutesD + stochInFiveMinutesK <= 80;

        const analysisResult = {
            assetRsi: assetRsiInFiveMinute,
            nasdaqRsi: nasdaqRsiInOneMinute,
            isPotentialBreak,
            isGoodRsiSignal,
            isGoodStochSignal,
        };

        return { asset, isPotentialBreak, isGoodRsiSignal, isGoodStochSignal };
    }

    async getClosings(assetId: number, candleDuration: number): Promise<number[]> {
        const tickers = await this.tickerService.getCandlesticks(assetId, candleDuration);

        return tickers.map(ticker => ticker.close);
    }
}
