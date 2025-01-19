import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';

import { ApiAccount, BingxApiClient, HttpRequestExecutor } from 'bingx-api';

@Injectable()
export class TradingService {

    private readonly apiKey = 'SfXh4FkhXuA8yylE7WTO1YxqdE1LKw6UTqvxPUtiQaUJWe27ZyuC1GKTkTEEhG5GXoHJzoFBpjQ3j2od6ALg';
    private readonly apiSecret = 'iHypwECLhsSMQuQDgQZabRHsRkupuDBz6smQTlgYBW2eucixai0ivGRnzt8jZgzILJAhSnVctYuQPl6PH1ZA';
    private readonly baseUrl = 'https://open-api.bingx.com';

    async test() {
        const account = new ApiAccount(this.apiKey, this.apiSecret);
        const client = new BingxApiClient(new HttpRequestExecutor());

        const userBalance = await client.getAccountService().getPerpetualSwapAccountAssetInformation(account);
        console.log('User balance:', userBalance);
    }

    /**
     * Places a market order and sets stop loss and take profit orders.
     * @param symbol - Trading pair symbol (e.g., BTCUSDT)
     * @param side - BUY or SELL
     * @param quantity - Quantity of the asset to trade
     * @param stopLossPrice - Price at which to set the stop loss
     * @param takeProfitPrice - Price at which to set the take profit
     */
    async placeOrderWithSLTP(
        symbol: string,
        side: string,
        quantity: number,
        stopLossPrice: number,
        takeProfitPrice: number,
    ) {
        // Place the market order
        const marketOrder = await this.placeMarketOrder(symbol, side, quantity);
        console.log('Market order placed:', marketOrder);

        // Determine the opposite side for stop orders
        const oppositeSide = side === 'BUY' ? 'SELL' : 'BUY';

        // Set the trailing SL and TP order
        const stopLossOrder = await this.setStopOrder(
            symbol,
            oppositeSide,
            'SHORT',
            quantity,
            stopLossPrice,
            'STOP_MARKET',
        );
        console.log('Stop loss order placed:', stopLossOrder);

        // // Set the stop loss order
        // const stopLossOrder = await this.setStopOrder(
        //     symbol,
        //     oppositeSide,
        //     'SHORT',
        //     quantity,
        //     stopLossPrice,
        //     'STOP_MARKET',
        // );
        // console.log('Stop loss order placed:', stopLossOrder);

        // // Set the take profit order
        // const takeProfitOrder = await this.setStopOrder(
        //     symbol,
        //     oppositeSide,
        //     'LONG',
        //     quantity,
        //     takeProfitPrice,
        //     'TAKE_PROFIT_MARKET',
        // );
        // console.log('Take profit order placed:', takeProfitOrder);
    }

    /**
     * Generates a HMAC signature for API requests.
     * @param queryString - Query string to sign
     * @returns Signature
     */
    private generateSignature(queryString: string): string {
        return crypto
            .createHmac('sha256', this.apiSecret)
            .update(queryString)
            .digest('hex');
    }

    /**
     * Places a market order.
     * @param symbol - Trading pair symbol (e.g., BTCUSDT)
     * @param side - BUY or SELL
     * @param quantity - Quantity of the asset to trade
     */
    private async placeMarketOrder(symbol: string, side: string, quantity: number) {
        const endpoint = '/openApi/swap/v2/trade/order';
        const timestamp = Date.now();
        const params = new URLSearchParams({
            symbol,
            side,
            positionSide: 'LONG',
            type: 'MARKET',
            quantity: quantity.toString(),
            timestamp: timestamp.toString(),
        });

        const signature = this.generateSignature(params.toString());
        params.append('signature', signature);

        try {
            const response = await axios.post(`${this.baseUrl}${endpoint}?${params}`, null, {
                headers: {
                    'X-BX-APIKEY': this.apiKey,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error placing market order:', error.response?.data || error.message);
            throw new HttpException(
                'Failed to place market order',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Sets a stop order (stop loss or take profit).
     * @param symbol - Trading pair symbol (e.g., BTCUSDT)
     * @param side - BUY or SELL
     * @param quantity - Quantity of the asset to trade
     * @param stopPrice - Stop price for the order
     * @param stopType - STOP_MARKET for stop loss, TAKE_PROFIT_MARKET for take profit
     */
    private async setStopOrder(
        symbol: string,
        side: string,
        positionSide: string,
        quantity: number,
        stopPrice: number,
        stopType: string,
    ) {
        const endpoint = '/openApi/swap/v2/trade/order';
        const timestamp = Date.now();
        const params = new URLSearchParams({
            symbol,
            side,
            positionSide,
            type: stopType,
            quantity: quantity.toString(),
            stopPrice: stopPrice.toString(),
            timestamp: timestamp.toString(),
        });

        const signature = this.generateSignature(params.toString());
        params.append('signature', signature);

        try {
            const response = await axios.post(`${this.baseUrl}${endpoint}?${params}`, null, {
                headers: {
                    'X-BX-APIKEY': this.apiKey,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error placing ${stopType} order:`, error.response?.data || error.message);
            throw new HttpException(
                `Failed to place ${stopType} order`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
