import { Injectable } from '@nestjs/common';
import { HttpService } from '../../_common/http/http.service';
import { StringUtil } from '../../../utils/string.util';
import { LoggerUtil } from '../../../utils/logger.util';

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

    async sendMessage(text: string): Promise<void> {
        const url = `${this.apiUrl}${this.apiToken}/sendMessage`;
        const params = { chat_id: this.recipient, text };

        try {
            await this.httpService.post(url, params);
            LoggerUtil.log('Telegram message sent');
        } catch (error) {
            const { message } = error
            LoggerUtil.error(`Error sending Telegram message: ${message}`);
        }
    }
}
