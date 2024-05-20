import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerUtil } from '../../utils/logger.util';
import { IndicatorsService } from '../indicator/indicator.service';
import { TelegramService } from './telegram/telegram.service';
import { POTENTIAL_BEARISH_DIVERGENCE_MESSAGE, POTENTIAL_BULLISH_DIVERGENCE_MESSAGE } from './_config';

@Injectable()
export class NotificatorService {
    constructor(
        private readonly indicatorsService: IndicatorsService,
        private readonly telegramService: TelegramService,
    ) { }

    @Cron('*/5 * 7-23 * * *')
    async notifyPotentialDivergence() {
        const { bullish, bearish } = await this.indicatorsService.isPotentialDivergence();

        if (bullish) {
            LoggerUtil.debug(POTENTIAL_BULLISH_DIVERGENCE_MESSAGE);
            this.telegramService.sendMessage(POTENTIAL_BULLISH_DIVERGENCE_MESSAGE);
        } else if (bearish) {
            LoggerUtil.debug(POTENTIAL_BEARISH_DIVERGENCE_MESSAGE);
            this.telegramService.sendMessage(POTENTIAL_BEARISH_DIVERGENCE_MESSAGE);
        }
    }
}
