import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerUtil } from '../../utils/logger.util';
import { IndicatorsService } from '../indicator/indicator.service';
import { TelegramService } from './telegram/telegram.service';
import { POTENTIAL_DIVERGENCE_MESSAGE } from './_config';

@Injectable()
export class NotificatorService {
    constructor(
        private readonly indicatorsService: IndicatorsService,
        private readonly telegramService: TelegramService,
    ) { }

    @Cron('*/5 * 7-23 * * *')
    async notifyPotentialDivergence() {
        const { bullish, bearish } = await this.indicatorsService.isPotentialDivergence();

        if (bullish || bearish) {
            LoggerUtil.debug(POTENTIAL_DIVERGENCE_MESSAGE, { bullish, bearish });
            this.telegramService.sendMessage(POTENTIAL_DIVERGENCE_MESSAGE);
        }
    }
}
