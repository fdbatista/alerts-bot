import { Injectable } from '@nestjs/common';

import * as _ from 'lodash';
import { IntervalDataDTO } from './dto/indicators.dto';
import { AssetDTO } from '../ticker/dto/asset.dto';
import { PROCESS_ENTRYPOINTS, RUN_TECHNICAL_ANALYSIS } from '../websocket/_config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TechnicalAnalysisResult } from './dto/technical-analysis-result.dto';
import { TrendAnalysisService } from './trend-analysis.service';
import { PotentialEntrypoint, PotentialEntrypointType } from './dto/potential-entrypoint.dto';

@Injectable()
export class TechnicalAnalysisService {

    constructor(
        private readonly trendAnalysisService: TrendAnalysisService,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    @OnEvent(RUN_TECHNICAL_ANALYSIS, { async: true })
    runTechnicalAnalysis(asset: AssetDTO, indicators: IntervalDataDTO[]): void {
        const result: TechnicalAnalysisResult[] = [];

        for (const indicator of indicators) {
            const { interval, closings } = indicator;
            const currentPrice = closings.at(-1) as number;

            const potentialEntrypoints: PotentialEntrypoint[] = [];

            const potentialTrendChange = this.trendAnalysisService.analyzeBearishTrend(closings);

            if (potentialTrendChange) {
                potentialEntrypoints.push({ type: PotentialEntrypointType.BREAK, context: null, currentPrice });
            }

            const smaCrossovers = this.trendAnalysisService.detectSMACrossovers(closings);

            if (smaCrossovers.sma50Cross) {
                potentialEntrypoints.push({ type: PotentialEntrypointType.GOLDEN_CROSS, context: 'SMA10 crosses above SMA50', currentPrice });
            }

            if (smaCrossovers.sma200Cross) {
                potentialEntrypoints.push({ type: PotentialEntrypointType.GOLDEN_CROSS, context: 'SMA10 crosses above SMA200', currentPrice });
            }

            if (potentialEntrypoints.length) {
                result.push({ asset, interval, potentialEntrypoints });
            }
        }

        if (result.length) {
            this.eventEmitter.emit(PROCESS_ENTRYPOINTS, result, indicators);
        }
    }
}
