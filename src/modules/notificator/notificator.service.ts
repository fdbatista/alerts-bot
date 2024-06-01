import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerUtil } from '../../utils/logger.util';
import { IndicatorsService } from '../technical-analysis/indicators.service';
import { TelegramService } from './telegram/telegram.service';
import { POTENTIAL_BEARISH_DIVERGENCE_MESSAGE, POTENTIAL_BULLISH_DIVERGENCE_MESSAGE } from './_config';
import { PatternsService } from '../technical-analysis/patterns.service';

@Injectable()
export class NotificatorService {
    constructor(
        private readonly patternsService: PatternsService,
        private readonly telegramService: TelegramService,
    ) { }

    @Cron('* 7-23 * * *')
    async notifyPotentialDivergence() {
        const { bullish, bearish } = await this.patternsService.isPotentialBreakage();

        if (bullish) {
            LoggerUtil.debug(POTENTIAL_BULLISH_DIVERGENCE_MESSAGE);
            this.telegramService.sendMessage(POTENTIAL_BULLISH_DIVERGENCE_MESSAGE);
        } else if (bearish) {
            LoggerUtil.debug(POTENTIAL_BEARISH_DIVERGENCE_MESSAGE);
            this.telegramService.sendMessage(POTENTIAL_BEARISH_DIVERGENCE_MESSAGE);
        }
    }
}
