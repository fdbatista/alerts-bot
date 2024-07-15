import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerUtil } from 'src/utils/logger.util';
import { TelegramService } from './telegram/telegram.service';
import { EntrypointDetectorService } from 'src/modules/technical-analysis/entrypoint-detector.service';
import { POTENTIAL_BREAK_MESSAGE, POTENTIAL_RSI_MESSAGE } from './_config';
import { AssetService } from '../asset/asset.service';
import { Asset } from 'src/database/entities/asset';

const STOCKS_TYPE_ID = 2

@Injectable()
export class NotificatorService {
    constructor(
        private readonly assetService: AssetService,
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
        const activeAssets = await this.assetService.getActiveAssetsByTypeId(assetTypeId);

        const promises = activeAssets.map(async (asset: Asset) => {
            return this.entrypointDetectorService.isPotentialGoodEntrypoint(asset.id);
        })

        const results = await Promise.allSettled(promises);

        let message = '';

        results.forEach((result: any, index) => {
            const { value } = result
            const { isPotentialBreak, isGoodRsiSignal } = value

            if (isPotentialBreak || isGoodRsiSignal) {
                const asset = activeAssets[index];

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
