import { Injectable } from '@nestjs/common';
import { PotentialEntrypoint } from 'src/modules/technical-analysis/entrypoint-detector.service';
import { MESSAGES } from './_config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ALERT_ON_TELEGRAM_MESSAGE, TECHNICAL_ANALYZE_FNISHED_MESSAGE } from '../technical-analysis/listeners/config';

@Injectable()
export class NotificatorService {
    constructor(
        private readonly eventEmitter: EventEmitter2
    ) { }

    @OnEvent(TECHNICAL_ANALYZE_FNISHED_MESSAGE, { async: true })
    async analyzeTechnicalResults(results: PotentialEntrypoint[]): Promise<void> {
        const positiveValidations = results.map(result => {
            const { asset, isPotentialBreak, isGoodRsiSignal, isGoodStochSignal } = result;
            const analysisResult = { isPotentialBreak, isGoodRsiSignal, isGoodStochSignal };

            const positiveValidations = Object.entries(analysisResult)
                .filter(([, value]) => value === true)
                .map(([key]) => MESSAGES[key as keyof typeof MESSAGES]);

            if (positiveValidations.length > 0) {
                const validationsString = positiveValidations.join(', ');
                return `Potential entrypoint for ${asset.name} by ${validationsString}`;
            }

            return null;
        }).filter(message => message);

        if (positiveValidations.length > 0) {
            const message = positiveValidations.join('\n');
            this.eventEmitter.emit(ALERT_ON_TELEGRAM_MESSAGE, message);
        }
    }

}
