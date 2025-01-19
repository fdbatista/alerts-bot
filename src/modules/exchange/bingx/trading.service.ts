import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { StringUtil } from 'src/utils/string.util';

dotenv.config();

@Injectable()
export class TradingService {

    private apiKey: string;
    private apiSecret: string;
    private headers: Record<string, string>;
    private readonly baseUrl = 'https://open-api.bingx.com';
    private readonly placeOrderEndpoint = '/openApi/swap/v2/trade/order';

    constructor(private httpService: HttpService, private configService: ConfigService) {
        this.apiSecret = this.configService.get<string>('BINGX_API_SECRET') || StringUtil.EMPTY_STRING;

        const apiKey = this.configService.get<string>('BINGX_API_KEY') || StringUtil.EMPTY_STRING;
        this.headers = { 'X-BX-APIKEY': apiKey };
    }

    // Place a market order
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
            const response = await axios.post(`${this.baseUrl}${this.placeOrderEndpoint}?${params}`, null, { headers: this.headers });
            return response.data;
        } catch (error) {
            console.error('Error placing market order:', error.response?.data || error.message);
            throw new HttpException('Failed to place market order', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
   * Send a TRAILING_STOP_MARKET order to the BingX API
   * @param symbol - The trading pair (e.g., 'BTCUSDT')
   * @param side - 'BUY' or 'SELL'
   * @param quantity - Quantity to trade
   * @param callbackRate - Trailing callback rate (percentage)
   * @returns API response
   */
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
                callbackRate: callbackRate.toString(),
                timestamp: timestamp.toString(),
            };

            const params = new URLSearchParams(payload);

            const signature = this.generateSignature(params.toString());
            params.append('signature', signature);

            const response = await axios.post(`${this.baseUrl}${this.placeOrderEndpoint}?${params}`, null, { headers: this.headers });

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
