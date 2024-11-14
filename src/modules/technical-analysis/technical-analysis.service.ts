import { Injectable } from '@nestjs/common';

import { PatternsService } from './patterns.service';
import * as _ from 'lodash';
import { IndicatorsDTO } from './dto/indicators.dto';
import { AssetDTO } from '../ticker/dto/asset.dto';
import { NOTIFY_TECHNICAL_RESULT, RUN_TECHNICAL_ANALYSIS } from '../websocket/_config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TechnicalAnalysisResult } from './dto/technical-analysis-result.dto';

@Injectable()
export class TechnicalAnalysisService {

    constructor(
        private readonly patternsService: PatternsService,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    @OnEvent(RUN_TECHNICAL_ANALYSIS, { async: true })
    runTechnicalAnalysis(asset: AssetDTO, indicators: IndicatorsDTO[]): void {
        const result: TechnicalAnalysisResult[] = [];

        for (const indicator of indicators) {
            const { interval, closings, sma } = indicator;

            const potentialEntrypoints = this.patternsService.detectPotentialEntrypoints(closings, sma);

            if (potentialEntrypoints.length) {
                result.push({ asset, interval, potentialEntrypoints });
            }
        }

        if (result.length) {
            this.eventEmitter.emit(NOTIFY_TECHNICAL_RESULT, result, indicators);
        }
    }

}
