import { Injectable } from '@nestjs/common';
import { MESSAGES } from './_config';
import { OnEvent } from '@nestjs/event-emitter';
import { NOTIFY_TECHNICAL_RESULT } from '../technical-analysis/indicators-builder/config';
import { TelegramService } from './telegram/telegram.service';
import { IndicatorsDTO } from '../technical-analysis/dto/indicators.dto';
import { PotentialEntrypoint } from '../technical-analysis/dto/potential-entrypoint.dto';

@Injectable()
export class NotificatorService {
    constructor(
        private readonly telegramService: TelegramService,
    ) { }

    @OnEvent(NOTIFY_TECHNICAL_RESULT, { async: true })
    async analyzeTechnicalResults(entrypoints: PotentialEntrypoint[], indicators: IndicatorsDTO[]): Promise<void> {
        // const positiveValidations = entrypoints.map(result => {
        //     const { asset } = result;

        //     const positiveValidations = Object.entries(result)
        //         .filter(([, value]) => value === true)
        //         .map(([key]) => MESSAGES[key as keyof typeof MESSAGES]);

        //     if (positiveValidations.length > 0) {
        //         const validationsString = positiveValidations.join(', ');
        //         return `Potential entrypoint for ${asset.symbol} by ${validationsString}`;
        //     }

        //     return null;
        // }).filter(message => message);

        // if (positiveValidations.length > 0) {
        //     const message = positiveValidations.join('\n');
        //     this.telegramService.sendMessage(message);
        // }
    }

}
