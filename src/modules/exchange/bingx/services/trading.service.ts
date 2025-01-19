import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BINGX_ENDPOINTS } from '../_config';
import { firstValueFrom } from 'rxjs';
import { BingXService } from './bingx.service';

@Injectable()
export class BingXTradingService extends BingXService {

    constructor(httpService: HttpService, configService: ConfigService) {
        super(httpService, configService);
    }

    async placeMarketOrderWithTrailingStop(symbol: string, side: string, quantity: number): Promise<any> {
        const marketOrder = await this.placeMarketOrder(symbol, side, quantity);
        const trailingStopOrder = await this.sendTrailingStopMarketOrder(symbol, side === 'BUY' ? 'SELL' : 'BUY', quantity, 0.005);

        return { marketOrder, trailingStopOrder };
    }

    private async placeMarketOrder(symbol: string, side: string, quantity: number) {
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
            const promise = this.httpService.post(endpoint, null, { headers: this.headers });
            const response = await firstValueFrom(promise);

            return response.data;
        } catch (error) {
            console.error('Error placing market order:', error.response?.data || error.message);
            throw new HttpException('Failed to place market order', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async sendTrailingStopMarketOrder(
        symbol: string,
        side: 'BUY' | 'SELL',
        quantity: number,
        priceRate: number,
    ): Promise<any> {
        try {
            const timestamp = Date.now();

            const payload = {
                symbol,
                side,
                positionSide: 'LONG',
                type: 'TRAILING_STOP_MARKET',
                quantity: quantity.toString(),
                priceRate: priceRate.toString(),
                timestamp: timestamp.toString(),
            };

            const params = new URLSearchParams(payload);

            const signature = this.generateSignature(params.toString());
            params.append('signature', signature);

            const endpoint = `${BINGX_ENDPOINTS.baseUrl}${BINGX_ENDPOINTS.placeOrder.uri}?${params}`

            const promise = this.httpService.post(endpoint, null, { headers: this.headers });
            const response = await firstValueFrom(promise);

            const { data } = response;

            return data;
        } catch (error) {
            throw new HttpException(
                error.response?.data || 'Failed to place order',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
