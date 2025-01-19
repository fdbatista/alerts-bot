import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DateUtil } from 'src/utils/date.util';
import { BINGX_ENDPOINTS } from '../_config';
import { firstValueFrom } from 'rxjs';
import { BingXService } from './bingx.service';

@Injectable()
export class BingXBalanceService extends BingXService {

    constructor(httpService: HttpService, configService: ConfigService) {
        super(httpService, configService);
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
}
