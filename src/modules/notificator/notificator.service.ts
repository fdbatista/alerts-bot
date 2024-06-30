import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerUtil } from 'src/utils/logger.util';
import { TelegramService } from './telegram/telegram.service';
import { POTENTIAL_ENTRYPOINT_MESSAGE } from './_config';
import { EntrypointDetectorService } from 'src/modules/technical-analysis/entrypoint-detector.service';

@Injectable()
export class NotificatorService {
    constructor(
        private readonly telegramService: TelegramService,
        private readonly entrypointDetectorService: EntrypointDetectorService,
    ) { }

    @Cron('3 * * * * *')
    async notifyPotentialDivergence() {
        const { isPotentialBreak, isGoodStochSignal } = await this.entrypointDetectorService.isPotentialGoodEntrypoint();

        if (isPotentialBreak || isGoodStochSignal) {
            LoggerUtil.debug(POTENTIAL_ENTRYPOINT_MESSAGE);
            this.telegramService.sendMessage(POTENTIAL_ENTRYPOINT_MESSAGE);
        }
    }
}
