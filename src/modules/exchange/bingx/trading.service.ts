import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { StringUtil } from 'src/utils/string.util';
import { DateUtil } from 'src/utils/date.util';
import { BINGX_ENDPOINTS } from './_config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TradingService {
    private apiKey: string;
    private apiSecret: string;
    private headers: Record<string, string>;
    
    constructor(private httpService: HttpService, private configService: ConfigService) {
        this.apiSecret = this.configService.get<string>('BINGX_API_SECRET') || StringUtil.EMPTY_STRING;

        const apiKey = this.configService.get<string>('BINGX_API_KEY') || StringUtil.EMPTY_STRING;
        this.headers = { 'X-BX-APIKEY': apiKey };
    }

    async fetchUserBalance() {
        try {
            const timestamp = DateUtil.getCurrentMillis();
            const queryString = `timestamp=${timestamp}`;
            const signature = this.generateSignature(queryString);

            const endpoint = `${BINGX_ENDPOINTS.baseUrl}${BINGX_ENDPOINTS.userBalance.uri}`;
            const url = `${endpoint}?${queryString}&signature=${signature}`;

            const promise = this.httpService.get(url, { headers: this.headers });
            const response = await firstValueFrom(promise);

            return response.data;
        } catch (error) {
            console.error('Error fetching user balance:', error.response?.data || error.message);
            throw error;
        }
    }

    async placeMarketOrder(symbol: string, side: string, quantity: number) {
        const timestamp = Date.now();

        const payload = {
            symbol,
            side,
            positionSide: 'LONG',
            type: 'MARKET',
            quantity: quantity.toString(),
            timestamp: timestamp.toString(),
        };

        const params = new URLSearchParams(payload);

        const signature = this.generateSignature(params.toString());
        params.append('signature', signature);

        try {
            const endpoint = `${BINGX_ENDPOINTS.baseUrl}${BINGX_ENDPOINTS.placeOrder.uri}?${params}`;
            const response = await axios.post(`${endpoint}`, null, { headers: this.headers });
            return response.data;
        } catch (error) {
            console.error('Error placing market order:', error.response?.data || error.message);
            throw new HttpException('Failed to place market order', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async sendTrailingStopMarketOrder(
        symbol: string,
        side: 'BUY' | 'SELL',
        quantity: number,
        callbackRate: number,
    ): Promise<any> {
        try {
            const timestamp = Date.now();

            const payload = {
                symbol,
                side,
                positionSide: 'LONG',
                type: 'TRAILING_STOP_MARKET',
                quantity: quantity.toString(),
                priceRate: '0.005',
                timestamp: timestamp.toString(),
            };

            const params = new URLSearchParams(payload);

            const signature = this.generateSignature(params.toString());
            params.append('signature', signature);

            const endpoint = `${BINGX_ENDPOINTS.baseUrl}${BINGX_ENDPOINTS.placeOrder.uri}?${params}`
            const response = await axios.post(endpoint, null, { headers: this.headers });

            const { data } = response;

            return data;
        } catch (error) {
            throw new HttpException(
                error.response?.data || 'Failed to place order',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private generateSignature(queryString: string): string {
        return crypto
            .createHmac('sha256', this.apiSecret)
            .update(queryString)
            .digest('hex');
    }
}
