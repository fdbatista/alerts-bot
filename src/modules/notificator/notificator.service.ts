import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PROCESS_ENTRYPOINTS } from '../websocket/_config';
import { TelegramService } from './telegram/telegram.service';
import { IntervalDataDTO } from '../technical-analysis/dto/indicators.dto';
import { TechnicalAnalysisResult } from '../technical-analysis/dto/technical-analysis-result.dto';
import { getIntervalAggregation } from '../_common/util/date.util';

@Injectable()
export class NotificatorService {
    constructor(
        private readonly telegramService: TelegramService,
    ) { }

    @OnEvent(PROCESS_ENTRYPOINTS, { async: true })
    async analyzeTechnicalResults(entrypoints: TechnicalAnalysisResult[], indicators: IntervalDataDTO[]): Promise<void> {
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
