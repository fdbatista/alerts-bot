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

        if (asset.typeId !== CRYPTO_ASSET_TYPE) {
            return;
        }

        const side = 'BUY';
        const quantity = 10 / currentPrice;

        const activatePrice = currentPrice + (currentPrice * 0.003);

        const marketOrder = await this.placeMarketOrder(asset.symbol, side, quantity);
        const tpSlOrder = await this.placeTrailingTPSLOrder(asset.symbol, 'SELL', quantity, activatePrice, 0.01);

        console.log('Orders: ', { marketOrder, tpSlOrder });
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
}
