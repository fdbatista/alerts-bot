import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BINGX_API_HOST, BINGX_API_PROTOCOL, BINGX_ENDPOINTS_CONFIG } from './_config';
import { StringUtil } from 'src/utils/string.util';
import { CryptoUtil } from 'src/utils/crypto.util';
import { HttpUtil } from 'src/utils/http.util';
import { DateUtil } from 'src/utils/date.util';

import * as CryptoJS from "crypto-js";
import axios from 'axios';

@Injectable()
export class BingxService {

    private apiSecret: string
    private headers: Record<string, string> = {}

    constructor(private httpService: HttpService, private configService: ConfigService) {
        this.apiSecret = this.configService.get<string>('BINGX_API_SECRET') || StringUtil.EMPTY_STRING;

        const apiKey = this.configService.get<string>('BINGX_API_KEY') || StringUtil.EMPTY_STRING;
        this.headers = { 'X-BX-APIKEY': apiKey };
    }

    async fetchUserBalance() {
        return await this.sendRequest({}, BINGX_ENDPOINTS_CONFIG.userBalance, this.headers, false);
    }

    async fetchTradingFees() {
        const payload = { recvWindow: 5000 }
        return await this.sendRequest(payload, BINGX_ENDPOINTS_CONFIG.tradingFees, this.headers, false);
    }

    async placeOrder() {
        const timestamp = new Date().getTime()

        const API = {
            "uri": "/openApi/swap/v2/trade/order",
            "method": "POST",
            "payload": {
                "symbol": "BTC-USDT",
                "side": "BUY",
                "positionSide": "LONG",
                "type": "MARKET",
                "quantity": 0.00010,
                "takeProfit": "{\"type\": \"TAKE_PROFIT_MARKET\", \"stopPrice\": 96700.0,\"price\": 96700.0,\"workingType\":\"MARK_PRICE\"}",
                "stopLoss": "{\"type\": \"STOP_MARKET\", \"stopPrice\": 96400.0,\"price\": 96400.0,\"workingType\":\"MARK_PRICE\"}",
                "timestamp": timestamp,
            },
            "protocol": "https"
        }

        // const sign = CryptoUtil.signRequest(this.getParameters(API, timestamp), this.apiSecret)

        const signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(this.getParameters(API, timestamp), this.apiSecret))
        const url = "https://open-api.bingx.com/openApi/swap/v2/trade/order?" + this.getParameters(API, timestamp, true) + "&signature=" + signature

        const config = {
            method: 'POST',
            url: url,
            headers: this.headers,
        };

        const resp = await axios(config);
        return resp.data;
    }

    private getParameters(API: any, timestamp: number, urlEncode: boolean = false) {
        let parameters = ""
        for (const key in API.payload) {
            if (urlEncode) {
                parameters += key + "=" + encodeURIComponent(API.payload[key]) + "&"
            } else {
                parameters += key + "=" + API.payload[key] + "&"
            }
        }
        if (parameters) {
            parameters = parameters.substring(0, parameters.length - 1)
            parameters = parameters + "&timestamp=" + timestamp
        } else {
            parameters = "timestamp=" + timestamp
        }
        return parameters
    }

    private async sendRequest(params: Record<string, any>, endpointConfig: { method: string, uri: string }, headers: Record<string, string>, urlEncode: boolean) {
        const { method, uri } = endpointConfig;

        try {
            const timestamp = DateUtil.getCurrentMillis()
            const payload = { ...params, timestamp }

            const url = this.buildSignedUrl(uri, payload, urlEncode);
            const promise = this.httpService.request({ method, url, headers });
            const { data } = await firstValueFrom(promise);

            return data;
        } catch (error) {
            const message = error.response?.data || `Error consuming ${uri}`
            const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR

            throw new HttpException(message, status);
        }
    }

    private buildSignedUrl(uri: string, payload: any, urlEncode: boolean): string {
        const queryParams = HttpUtil.buildQueryParams(payload, urlEncode);
        const signature = CryptoUtil.signRequest(queryParams, this.apiSecret);

        return `${BINGX_API_PROTOCOL}://${BINGX_API_HOST}${uri}?${queryParams}&signature=${signature}`;
    }
}
