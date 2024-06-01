import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerUtil } from '../../utils/logger.util';
import { TelegramService } from './telegram/telegram.service';
import { POTENTIAL_BULLISH_DIVERGENCE_MESSAGE } from './_config';
import { EntrypointDetectorService } from '../technical-analysis/entrypoint-detector.service';

@Injectable()
export class NotificatorService {
    constructor(
        private readonly telegramService: TelegramService,
        private readonly entrypointDetectorService: EntrypointDetectorService,
    ) { }

    @Cron('* 7-23 * * *')
    async notifyPotentialDivergence() {
        const isPotentialEntrypoint = await this.entrypointDetectorService.isPotentialGoodEntrypoint();

        if (isPotentialEntrypoint) {
            LoggerUtil.debug(POTENTIAL_BULLISH_DIVERGENCE_MESSAGE);
            this.telegramService.sendMessage(POTENTIAL_BULLISH_DIVERGENCE_MESSAGE);
        }
    }
}
