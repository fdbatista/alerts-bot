import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerUtil } from 'src/utils/logger.util';
import { TelegramService } from './telegram/telegram.service';
import { EntrypointDetectorService } from 'src/modules/technical-analysis/entrypoint-detector.service';
import { POTENTIAL_BREAK_MESSAGE, POTENTIAL_RSI_MESSAGE } from './_config';

const STOCKS_TYPE_ID = 2

@Injectable()
export class NotificatorService {
    constructor(
        private readonly telegramService: TelegramService,
        private readonly entrypointDetectorService: EntrypointDetectorService,
    ) { }

    @Cron(`2 30,33-59 15 * * 1-5`) // Every minute from 15:30 to 15:59 on Monday to Friday
    async detectPotentialEntrypointFrom1530To1559() {
        this.notifyPotentialDivergence(STOCKS_TYPE_ID);
    }

    @Cron(`2 * 16-21 * * 1-5`)  // Every minute from 16:00 to 21:59 on Monday to Friday
    async detectPotentialEntrypointFrom1600To2159() {
        this.notifyPotentialDivergence(STOCKS_TYPE_ID);
    }

    async notifyPotentialDivergence(assetTypeId: number) {
        const results = await this.entrypointDetectorService.detectPotentialEntrypoints(assetTypeId);

        let message = '';

        results.forEach((result: any) => {
            const { isPotentialBreak, isGoodRsiSignal, asset } = result;

            if (isPotentialBreak || isGoodRsiSignal) {
                message += `Potential entrypoint for ${asset.name} by `;

                if (isPotentialBreak) {
                    message += POTENTIAL_BREAK_MESSAGE;
                }

                if (isGoodRsiSignal) {
                    message += POTENTIAL_RSI_MESSAGE;
                }

                message += '\n';
            }
        })

        if (message) {
            LoggerUtil.debug(message);
            this.telegramService.sendMessage(message);
        }
    }

}
