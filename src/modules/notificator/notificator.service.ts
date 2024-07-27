import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerUtil } from 'src/utils/logger.util';
import { TelegramService } from './telegram/telegram.service';
import { EntrypointDetectorService } from 'src/modules/technical-analysis/entrypoint-detector.service';
import { POTENTIAL_BREAK_MESSAGE, POTENTIAL_RSI_MESSAGE, POTENTIAL_STOCH_MESSAGE } from './_config';

const CRYPTOS_TYPE_ID = 1
const STOCKS_TYPE_ID = 2

@Injectable()
export class NotificatorService {
    constructor(
        private readonly telegramService: TelegramService,
        private readonly entrypointDetectorService: EntrypointDetectorService,
    ) { }

    @Cron(`2 30,33-59 15 * * 1-5`) // Every minute from 15:30 to 15:59 on Monday to Friday
    async detectPotentialEntrypointFrom1530To1559() {
        this.notifyPotentialEntrypoint([STOCKS_TYPE_ID, CRYPTOS_TYPE_ID]);
    }

    @Cron(`2 * 16-21 * * 1-5`)  // Every minute from 16:00 to 21:59 on Monday to Friday
    async detectPotentialEntrypointFrom1600To2159() {
        this.notifyPotentialEntrypoint([STOCKS_TYPE_ID, CRYPTOS_TYPE_ID]);
    }

    @Cron(`2 * 0-14 * * 1-5`) // Every minute from 00:00 to 14:59 on weekdays
    async detectPotentialEntrypointFrom0000To1459OnWeekdays() {
        this.notifyPotentialEntrypoint([CRYPTOS_TYPE_ID]);
    }

    @Cron(`2 * * * * 6,0`) // Every minute on weekends
    async detectPotentialEntrypointOnWeekends() {
        this.notifyPotentialEntrypoint([CRYPTOS_TYPE_ID]);
    }

    async notifyPotentialEntrypoint(assetTypeIds: number[]): Promise<void> {
        const results = await this.entrypointDetectorService.detectPotentialEntrypoints(assetTypeIds);
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
            LoggerUtil.debug(message);
            this.telegramService.sendMessage(message);
        }
    }

}
