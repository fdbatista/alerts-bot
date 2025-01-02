import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BINGX_API_HOST, BINGX_API_PROTOCOL, BINGX_USER_BALANCE_URI } from './_config';
import { StringUtil } from 'src/utils/string.util';
import { CryptoUtil } from 'src/utils/crypto.util';
import { HttpUtil } from 'src/utils/http.util';

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
            const url = this.buildSignedUrl(BINGX_USER_BALANCE_URI)
            const promise = this.httpService.get(url, { headers: this.headers });
            const { data } = await firstValueFrom(promise);

            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error fetching balance', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private buildSignedUrl(uri: string): string { 
        const timestamp = new Date().getTime()
        const payload = { timestamp }

        const queryParams = HttpUtil.buildQueryParams(payload, false)
        const signature = CryptoUtil.signRequest(queryParams, this.apiSecret)

        return `${BINGX_API_PROTOCOL}://${BINGX_API_HOST}${uri}?${queryParams}&signature=${signature}`
    }
}
