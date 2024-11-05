import { Injectable } from '@nestjs/common';

import { PatternsService } from './patterns.service';
import { TickerService } from '../ticker/ticker.service';
import { Asset } from 'src/database/entities/asset';
import { RsiRepository } from './indicators-builder/repository/rsi.repository';
import { StochRepository } from './indicators-builder/repository/stoch.repository';
import { NASDAQ_ID, RSI_ENTRYPOINT_THRESHOLD } from './_config';
import * as _ from 'lodash';
import { IndicatorsDTO } from './dto/indicators.dto';
import { AssetDTO } from '../ticker/dto/asset.dto';
import { PotentialEntrypoint } from './dto/potential-entrypoint.dto';
import { NOTIFY_TECHNICAL_RESULT, RUN_TECHNICAL_ANALYSIS } from './indicators-builder/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EntrypointDetectorService {

    constructor(
        private readonly tickerService: TickerService,
        private readonly patternsService: PatternsService,
        private readonly rsiRepository: RsiRepository,
        private readonly stochRepository: StochRepository,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    @OnEvent(RUN_TECHNICAL_ANALYSIS, { async: true })
    runTechnicalAnalysis(asset: AssetDTO, indicators: IndicatorsDTO[]): void {
        const result: PotentialEntrypoint[] = []

        // if (stocks.length > 0) {
        //     const nasdaqRsiInOneMinute: number = await this.getAssetRsi(NASDAQ_ID, 1);

        //     for (const asset of stocks) {
        //         const potentialEntrypoint = await this.isPotentialGoodEntrypointForStock(asset, nasdaqRsiInOneMinute);
        //         result.push(potentialEntrypoint);
        //     }
        // }

        // for (const asset of assets) {
        //     const potentialEntrypoint = await this.isPotentialGoodEntrypointForCrypto(asset);
        //     result.push(potentialEntrypoint);
        // }

        if (result.length > 0) {
            this.eventEmitter.emit(NOTIFY_TECHNICAL_RESULT, result, indicators);
        } else {
            console.log(`No potential entrypoints found for ${asset.symbol}`);
        }
    }

    // private async isPotentialGoodEntrypointForStock(asset: Asset, nasdaqRsiInOneMinute: number): Promise<PotentialEntrypoint> {
    //     const { byBreak, byStoch } = await this.analyzePotentialBreakAndStochSignal(asset);

    //     const assetRsiInFiveMinutes: number = await this.getAssetRsi(asset.id, 5);
    //     const byRsi = assetRsiInFiveMinutes <= RSI_ENTRYPOINT_THRESHOLD && nasdaqRsiInOneMinute <= RSI_ENTRYPOINT_THRESHOLD;

    //     return { asset, byBreak, byStoch, byRsi };
    // }

    // private async isPotentialGoodEntrypointForCrypto(asset: Asset): Promise<PotentialEntrypoint> {
    //     const { byBreak, byStoch } = await this.analyzePotentialBreakAndStochSignal(asset);

    //     const assetRsiInFiveMinutes: number = await this.getAssetRsi(asset.id, 5);
    //     const byRsi = assetRsiInFiveMinutes <= RSI_ENTRYPOINT_THRESHOLD;

    //     return { asset, byBreak, byStoch, byRsi };
    // }

    private async analyzePotentialBreakAndStochSignal(asset: Asset) {
        const assetClosingsInOneMinute = await this.getClosings(asset.id, 1, 30);
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

    async getClosings(assetId: number, candleDuration: number, take: number): Promise<number[]> {
        const candlesticks = await this.tickerService.generateCandlesticks(assetId, candleDuration, take);
        return candlesticks.map(ticker => ticker.close);
    }

    private detectCloseBounce(prices: number[], smaValues: number[], threshold = 0.01): boolean {
        let nearSMA = false;

        for (let i = 1; i < prices.length; i++) {
            const price = prices[i];
            const smaValue = smaValues[i];
            const smaThreshold = smaValue * threshold;

            const priceDiff = Math.abs(price - smaValue);

            // Check if price is within the threshold of SMA
            if (priceDiff <= smaThreshold) {
                nearSMA = true;
            }

            // Detect if the price bounces up after coming close to SMA
            if (nearSMA && price > smaValue + smaThreshold) {
                console.log(`Bounce detected near SMA at index ${i} with price ${price}`);
                return true;
                // nearSMA = false;  // Reset to detect next bounce
            }
        }

        return false;
    }

}
