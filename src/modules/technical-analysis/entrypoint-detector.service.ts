import { Injectable } from '@nestjs/common';

import { PatternsService } from './patterns.service';
import { TickerService } from '../ticker/ticker.service';
import { Asset } from 'src/database/entities/asset';
import { RsiRepository } from './indicators-builder/repository/rsi.repository';
import { StochRepository } from './indicators-builder/repository/stoch.repository';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { INDICATORS_UPDATED_MESSAGE, TECHNICAL_ANALYSIS_FNISHED_MESSAGE } from './indicators-builder/config';
import { NASDAQ_ID, RSI_ENTRYPOINT_THRESHOLD } from './_config';
import * as _ from 'lodash';
import { groupBy } from 'lodash';
import { IndicatorsUpdatedPayloadDTO } from './indicators-builder/indicators-updated-payload.dto';

export interface PotentialEntrypoint {
    asset: Asset;
    byBreak: boolean;
    byRsi: boolean;
    byStoch: boolean;
}

@Injectable()
export class EntrypointDetectorService {

    constructor(
        private readonly tickerService: TickerService,
        private readonly patternsService: PatternsService,
        private readonly rsiRepository: RsiRepository,
        private readonly stochRepository: StochRepository,
        private readonly eventEmitter: EventEmitter2
    ) { }

    @OnEvent(INDICATORS_UPDATED_MESSAGE, { async: true })
    async detectPotentialEntrypoints(payload: IndicatorsUpdatedPayloadDTO): Promise<void> {
        const { assets } = payload;
        const result: PotentialEntrypoint[] = []

        const assetsWtihType = await Promise.all(
            assets.map(async (asset) => ({
                ...asset,
                typeName: (await asset.type).name,
            }))
        );

        const assetsByType = groupBy(assetsWtihType, 'typeName');

        const stocks = assetsByType['Stock'] ?? [];
        const cryptos = assetsByType['Cryptocurrency'] ?? [];

        if (stocks.length > 0) {
            const nasdaqRsiInOneMinute: number = await this.getAssetRsi(NASDAQ_ID, 1);

            for (const asset of stocks) {
                const potentialEntrypoint = await this.isPotentialGoodEntrypointForStock(asset, nasdaqRsiInOneMinute);
                result.push(potentialEntrypoint);
            }
        }

        for (const asset of cryptos) {
            const potentialEntrypoint = await this.isPotentialGoodEntrypointForCrypto(asset);
            result.push(potentialEntrypoint);
        }

        this.eventEmitter.emit(TECHNICAL_ANALYSIS_FNISHED_MESSAGE, result);
    }

    private async isPotentialGoodEntrypointForStock(asset: Asset, nasdaqRsiInOneMinute: number): Promise<PotentialEntrypoint> {
        const { byBreak, byStoch } = await this.analyzePotentialBreakAndStochSignal(asset);

        const assetRsiInFiveMinutes: number = await this.getAssetRsi(asset.id, 5);
        const byRsi = assetRsiInFiveMinutes <= RSI_ENTRYPOINT_THRESHOLD && nasdaqRsiInOneMinute <= RSI_ENTRYPOINT_THRESHOLD;

        return { asset, byBreak, byStoch, byRsi };
    }

    private async isPotentialGoodEntrypointForCrypto(asset: Asset): Promise<PotentialEntrypoint> {
        const { byBreak, byStoch } = await this.analyzePotentialBreakAndStochSignal(asset);

        const assetRsiInFiveMinutes: number = await this.getAssetRsi(asset.id, 5);
        const byRsi = assetRsiInFiveMinutes <= RSI_ENTRYPOINT_THRESHOLD;

        return { asset, byBreak, byStoch, byRsi };
    }

    private async analyzePotentialBreakAndStochSignal(asset: Asset) {
        const assetClosingsInOneMinute = await this.getClosings(asset.id, 1);
        const byBreak = await this.patternsService.isPotentialBreak(assetClosingsInOneMinute);

        const { k: stochInOneMinuteK, d: stochInOneMinuteD } = await this.getLastStoch(asset.id, 1);
        const { k: stochInFiveMinutesK, d: stochInFiveMinutesD } = await this.getLastStoch(asset.id, 5);
        const byStoch = stochInOneMinuteD + stochInOneMinuteK + stochInFiveMinutesD + stochInFiveMinutesK <= 80;

        return { byBreak, byStoch };
    }

    private async getAssetRsi(assetId: number, minutes: number): Promise<number> {
        const lastRsi = await this.rsiRepository.getLatest(assetId, minutes);
        return lastRsi?.value ?? 100;
    }

    private async getLastStoch(assetId: number, minutes: number): Promise<{ k: number, d: number }> {
        const lastStoch = await this.stochRepository.getLatest(assetId, minutes);
        const k = lastStoch?.k ?? 100;
        const d = lastStoch?.d ?? 100;

        return { k, d };
    }

    async getClosings(assetId: number, candleDuration: number): Promise<number[]> {
        const tickers = await this.tickerService.getCandlesticks(assetId, candleDuration);

        return tickers.map(ticker => ticker.close);
    }

}
