import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BINGX_API_HOST, BINGX_API_PROTOCOL, BINGX_ENDPOINTS } from './_config';
import { StringUtil } from 'src/utils/string.util';
import { CryptoUtil } from 'src/utils/crypto.util';
import { HttpUtil } from 'src/utils/http.util';
import { DateUtil } from 'src/utils/date.util';

@Injectable()
export class BingxService {

    private apiKey: string
    private apiSecret: string
    private headers: Record<string, string> = {}

    constructor(private httpService: HttpService, private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('BINGX_API_KEY') || StringUtil.EMPTY_STRING;
        this.apiSecret = this.configService.get<string>('BINGX_API_SECRET') || StringUtil.EMPTY_STRING;
        this.headers = { 'X-BX-APIKEY': this.apiKey };
    }

    async fetchUserBalance() {
        try {
            const timestamp = DateUtil.getCurrentMillis()
            const payload = { timestamp }

            const url = this.buildSignedUrl(BINGX_ENDPOINTS.userBalance, payload);
            const promise = this.httpService.request({ method: 'GET', url, headers: this.headers });
            const { data } = await firstValueFrom(promise);

            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error fetching balance', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async fetchTradingFees() {
        try {
            const timestamp = DateUtil.getCurrentMillis()
            const payload = { timestamp, recvWindow: 5000 }
            const url = this.buildSignedUrl(BINGX_ENDPOINTS.tradingFees, payload);

            const promise = this.httpService.request({ method: 'GET', url, headers: this.headers });
            const { data } = await firstValueFrom(promise);

            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error fetching balance', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async placeOrder() {
        const payload = {  }
        return await this.sendRequest(payload, BINGX_ENDPOINTS.placeOrder.uri);
    }

    private async sendRequest(params: Record<string, any>, uri: string) {
        try {
            const timestamp = DateUtil.getCurrentMillis()
            const payload = { ...params, timestamp }

            const url = this.buildSignedUrl(uri, payload);
            const promise = this.httpService.get(url, { headers: this.headers });
            const { data } = await firstValueFrom(promise);

            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || `Error consuming ${uri}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private buildSignedUrl(uri: string, payload: any): string {
        const queryParams = HttpUtil.buildQueryParams(payload, false)
        const signature = CryptoUtil.signRequest(queryParams, this.apiSecret)

        return `${BINGX_API_PROTOCOL}://${BINGX_API_HOST}${uri}?${queryParams}&signature=${signature}`
    }
}
