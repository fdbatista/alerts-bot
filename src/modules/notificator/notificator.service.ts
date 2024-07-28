import { Injectable } from '@nestjs/common';
import { LoggerUtil } from 'src/utils/logger.util';
import { PotentialEntrypoint } from 'src/modules/technical-analysis/entrypoint-detector.service';
import { POTENTIAL_BREAK_MESSAGE, POTENTIAL_RSI_MESSAGE, POTENTIAL_STOCH_MESSAGE } from './_config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ALERT_ON_TELEGRAM_MESSAGE, TECHNICAL_ANALYZE_FNISHED_MESSAGE } from '../technical-analysis/listeners/config';

@Injectable()
export class NotificatorService {
    constructor(
        private readonly eventEmitter: EventEmitter2
    ) { }

    @OnEvent(TECHNICAL_ANALYZE_FNISHED_MESSAGE, { async: true })
    async analyzeTechnicalResults(results: PotentialEntrypoint[]): Promise<void> {
        let message = '';

        results.forEach((result: any) => {
            const { asset, isPotentialBreak, isGoodRsiSignal, isGoodStochSignal } = result;

            if (isPotentialBreak || isGoodRsiSignal) {
                message += `Potential entrypoint for ${asset.name} by `;

                if (isPotentialBreak) {
                    message += POTENTIAL_BREAK_MESSAGE;
                }

                if (isGoodRsiSignal) {
                    message += POTENTIAL_RSI_MESSAGE;
                }

                if (isGoodStochSignal) {
                    message += POTENTIAL_STOCH_MESSAGE;
                }

                message += '\n';
            }
        })

        if (message) {
            this.eventEmitter.emit(ALERT_ON_TELEGRAM_MESSAGE, message);
            LoggerUtil.debug(message);
        }
    }

}
