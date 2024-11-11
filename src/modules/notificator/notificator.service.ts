import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NOTIFY_TECHNICAL_RESULT } from '../technical-analysis/indicators-builder/config';
import { TelegramService } from './telegram/telegram.service';
import { IndicatorsDTO } from '../technical-analysis/dto/indicators.dto';
import { TechnicalAnalysisResult } from '../technical-analysis/dto/technical-analysis-result.dto';
import { getIntervalAggregation } from '../_common/util/date.util';

@Injectable()
export class NotificatorService {
    constructor(
        private readonly telegramService: TelegramService,
    ) { }

    @OnEvent(NOTIFY_TECHNICAL_RESULT, { async: true })
    async analyzeTechnicalResults(entrypoints: TechnicalAnalysisResult[], indicators: IndicatorsDTO[]): Promise<void> {
        for (const entrypoint of entrypoints) {
            const { asset, interval, potentialEntrypoints } = entrypoint;

            const entrypoints = potentialEntrypoints.map(potentialEntrypoint => {
                return `\n---------------------------\nType: ${potentialEntrypoint.type}\nContext: ${JSON.stringify(potentialEntrypoint.context)}`;
            }).join('\n');

            const timeFrame = getIntervalAggregation(interval);
            const message = `Asset: ${asset.symbol}\nInterval: ${timeFrame}\nEntrypoints:\n${entrypoints}`;

            await this.telegramService.sendMessage(message);
        }
    }

}
