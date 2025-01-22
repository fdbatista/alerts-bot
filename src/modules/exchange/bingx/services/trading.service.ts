import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BINGX_ENDPOINTS } from '../_config';
import { firstValueFrom } from 'rxjs';
import { BingXService } from './bingx.service';
import { OnEvent } from '@nestjs/event-emitter';
import { PROCESS_ENTRYPOINTS } from 'src/modules/websocket/_config';
import { TechnicalAnalysisResult } from 'src/modules/technical-analysis/dto/technical-analysis-result.dto';

const CRYPTO_ASSET_TYPE = 1;

const MIN_QUANTITIES: Record<string, number> = {
    ['BTC-USDT']: 0.001,
    ['LTC-USDT']: 0.1,
};

@Injectable()
export class BingXTradingService extends BingXService {

    constructor(httpService: HttpService, configService: ConfigService) {
        super(httpService, configService);
    }

    @OnEvent(PROCESS_ENTRYPOINTS, { async: true })
    async placeOrders(entrypoints: TechnicalAnalysisResult[]): Promise<any> {
        const [firstEntrypoint] = entrypoints;
        const { asset, potentialEntrypoints } = firstEntrypoint;
        const [{ currentPrice }] = potentialEntrypoints;

        const quantity = MIN_QUANTITIES[asset.symbol];
        // const quantity = 10 / currentPrice;

        if (!quantity) {
            return;
        }

        const marketOrder = await this.placeMarketOrder(asset.symbol, 'BUY', quantity);
        // const activatePrice = currentPrice + (currentPrice * 0.003);
        // const tpSlOrder = await this.placeTrailingTPSLOrder(asset.symbol, 'SELL', quantity, activatePrice, 0.01);
        // const tpSlOrder = await this.placeTrailingStopMarketOrder(asset.symbol, 'SELL', quantity, 0.01);

        const stopLoss = currentPrice - (currentPrice * 0.005);
        const slOrder = await this.placeStopMarketOrder(asset.symbol, 'SELL', quantity, stopLoss);

        const takeProfit = currentPrice + (currentPrice * 0.002);
        const tpOrder = await this.placeTakeProfitMarketOrder(asset.symbol, 'SELL', quantity, takeProfit);

        console.log('Orders: ', { marketOrder, slOrder, tpOrder });
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
            const promise = this.httpService.post(endpoint, null, { headers: this.headers });
            const response = await firstValueFrom(promise);

            return response.data;
        } catch (error) {
            console.error('Error placing market order:', error.response?.data || error.message);
            throw new HttpException('Failed to place market order', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async placeTrailingTPSLOrder(
        symbol: string,
        side: 'BUY' | 'SELL',
        quantity: number,
        activatePrice: number,
        priceRate: number
    ): Promise<any> {
        try {
            const timestamp = Date.now();

            const payload = {
                symbol,
                side,
                positionSide: side === 'BUY' ? 'LONG' : 'SHORT',
                type: 'TRAILING_TP_SL',
                quantity: quantity.toString(),
                activatePrice: activatePrice.toString(),
                priceRate: priceRate.toString(),
                timestamp: timestamp.toString(),
            };

            const params = new URLSearchParams(payload);
            const signature = this.generateSignature(params.toString());
            params.append('signature', signature);

            const endpoint = `${BINGX_ENDPOINTS.baseUrl}${BINGX_ENDPOINTS.placeOrder.uri}?${params}`;

            const response = await firstValueFrom(this.httpService.post(endpoint, null, { headers: this.headers }));

            return response.data;
        } catch (error) {
            throw new HttpException(
                error.response?.data || 'Failed to place order',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async placeTrailingStopMarketOrder(
        symbol: string,
        side: 'BUY' | 'SELL',
        quantity: number,
        priceRate: number
    ): Promise<any> {
        try {
            const timestamp = Date.now();

            const payload = {
                symbol,
                side,
                positionSide: side === 'BUY' ? 'LONG' : 'SHORT',
                type: 'TRAILING_STOP_MARKET',
                quantity: quantity.toString(),
                priceRate: priceRate.toString(),
                timestamp: timestamp.toString(),
            };

            const params = new URLSearchParams(payload);
            const signature = this.generateSignature(params.toString());
            params.append('signature', signature);

            const endpoint = `${BINGX_ENDPOINTS.baseUrl}${BINGX_ENDPOINTS.placeOrder.uri}?${params}`;

            const response = await firstValueFrom(this.httpService.post(endpoint, null, { headers: this.headers }));

            return response.data;
        } catch (error) {
            throw new HttpException(
                error.response?.data || 'Failed to place order',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async placeTakeProfitMarketOrder(
        symbol: string,
        side: 'BUY' | 'SELL',
        quantity: number,
        priceRate: number
    ): Promise<any> {
        try {
            const timestamp = Date.now();

            const payload = {
                symbol,
                side,
                positionSide: 'LONG',
                type: 'TAKE_PROFIT_MARKET',
                quantity: quantity.toString(),
                stopPrice: priceRate.toString(),
                timestamp: timestamp.toString(),
            };

            const params = new URLSearchParams(payload);
            const signature = this.generateSignature(params.toString());
            params.append('signature', signature);

            const endpoint = `${BINGX_ENDPOINTS.baseUrl}${BINGX_ENDPOINTS.placeOrder.uri}?${params}`;

            const response = await firstValueFrom(this.httpService.post(endpoint, null, { headers: this.headers }));

            return response.data;
        } catch (error) {
            throw new HttpException(
                error.response?.data || 'Failed to place order',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async placeStopMarketOrder(
        symbol: string,
        side: 'BUY' | 'SELL',
        quantity: number,
        priceRate: number
    ): Promise<any> {
        try {
            const timestamp = Date.now();

            const payload = {
                symbol,
                side,
                positionSide: 'LONG',
                type: 'STOP_MARKET',
                quantity: quantity.toString(),
                stopPrice: priceRate.toString(),
                timestamp: timestamp.toString(),
            };

            const params = new URLSearchParams(payload);
            const signature = this.generateSignature(params.toString());
            params.append('signature', signature);

            const endpoint = `${BINGX_ENDPOINTS.baseUrl}${BINGX_ENDPOINTS.placeOrder.uri}?${params}`;

            const response = await firstValueFrom(this.httpService.post(endpoint, null, { headers: this.headers }));

            return response.data;
        } catch (error) {
            throw new HttpException(
                error.response?.data || 'Failed to place order',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
