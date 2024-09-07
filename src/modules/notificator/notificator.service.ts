import { Injectable } from '@nestjs/common';
import { PotentialEntrypoint } from 'src/modules/technical-analysis/entrypoint-detector.service';
import { MESSAGES } from './_config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ALERT_ON_TELEGRAM_MESSAGE, TECHNICAL_ANALYSIS_FNISHED_MESSAGE } from '../technical-analysis/indicators-builder/config';

@Injectable()
export class NotificatorService {
    constructor(
        private readonly eventEmitter: EventEmitter2
    ) { }

    @OnEvent(TECHNICAL_ANALYSIS_FNISHED_MESSAGE, { async: true })
    async analyzeTechnicalResults(results: PotentialEntrypoint[]): Promise<void> {
        const positiveValidations = results.map(result => {
            const { asset } = result;

            const positiveValidations = Object.entries(result)
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
