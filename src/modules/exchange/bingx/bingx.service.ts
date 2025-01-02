import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CryptoJS from 'crypto-js';
import { firstValueFrom } from 'rxjs';
import { BINGX_API_HOST, BINGX_API_PROTOCOL, BINGX_USER_BALANCE_URI } from './_config';

import * as crypto from 'crypto'; // For generating HMAC signature
import * as querystring from 'querystring'; // To format query parameters


@Injectable()
export class BingxService {

    private apiSecret: string;
    private apiKey: string;
    private headers: object;

    constructor(
        configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.apiSecret = configService.get<string>('BINGX_API_SECRET') || '';
        this.apiKey = configService.get<string>('BINGX_API_KEY') || '';

        this.headers = {
            'X-BX-APIKEY': this.apiKey,
            'X-BX-APISECRET': this.apiSecret,
            'X-BingX-API-KEY': this.apiKey,
            'X-BingX-API-SECRET': this.apiSecret,
        };
    }

    async getUserBalance(): Promise<any> {
        try {
            const timestamp = Date.now();
            const params = { timestamp };

            const signature = this.generateSignature(params, timestamp);

            const url = `${BINGX_API_PROTOCOL}://${BINGX_API_HOST}${BINGX_USER_BALANCE_URI}?timestamp=${timestamp}&signature=${signature}`
            const promise = this.httpService.get(url, { headers: this.headers });
            const response = await firstValueFrom(promise);

            return response.data;
        } catch (error) {
            const message = error.response?.data || 'Error fetching user balance from BingX';
            throw new HttpException(message, HttpStatus.BAD_REQUEST);
        }
    }

    private generateSignature(params: Record<string, any>, timestamp: number): string {
        const queryString = querystring.stringify({ ...params, timestamp });
        const hmac = crypto.createHmac('sha256', this.apiSecret);
        hmac.update(queryString);

        return hmac.digest('hex');
    }
}
