import { Injectable } from '@nestjs/common';
import { HttpService } from '../../_common/http/http.service';
import { StringUtil } from '../../../utils/string.util';
import { LoggerUtil } from '../../../utils/logger.util';
import { OnEvent } from '@nestjs/event-emitter';
import { ALERT_ON_TELEGRAM_MESSAGE } from 'src/modules/technical-analysis/indicators-builder/config';

@Injectable()
export class TelegramService {
    private apiUrl: string;
    private apiToken: string;
    private recipient: string;

    constructor(private readonly httpService: HttpService) {
        this.apiUrl = process.env.TELEGRAM_API_URL ?? StringUtil.EMPTY_STRING;
        this.apiToken = process.env.TELEGRAM_API_TOKEN ?? StringUtil.EMPTY_STRING;
        this.recipient = process.env.TELEGRAM_RECIPIENT ?? StringUtil.EMPTY_STRING;
    }

    @OnEvent(ALERT_ON_TELEGRAM_MESSAGE, { async: true })
    async sendMessage(text: string): Promise<void> {
        const url = `${this.apiUrl}${this.apiToken}/sendMessage`;
        const params = { chat_id: this.recipient, text };

        try {
            await this.httpService.post(url, params);
        } catch (error) {
            const { message } = error
            LoggerUtil.error(`Error sending Telegram message: ${message}`);
        }
    }
}
