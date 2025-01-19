import * as crypto from 'crypto';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { StringUtil } from 'src/utils/string.util';

export class BingXService {
    protected apiSecret: string;
    protected headers: Record<string, string>;

    constructor(protected httpService: HttpService, configService: ConfigService) {
        this.apiSecret = configService.get<string>('BINGX_API_SECRET') || StringUtil.EMPTY_STRING;

        const apiKey = configService.get<string>('BINGX_API_KEY') || StringUtil.EMPTY_STRING;
        this.headers = { 'X-BX-APIKEY': apiKey };
    }

    protected generateSignature(queryString: string): string {
        return crypto
            .createHmac('sha256', this.apiSecret)
            .update(queryString)
            .digest('hex');
    }
}
