import { Injectable } from '@nestjs/common';
import { GetTickerResponse } from 'src/modules/_common/dto/ticker-dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AssetDTO } from 'src/modules/ticker/dto/asset.dto';
import { Ticker } from 'src/database/entities/ticker';

@Injectable()
export class WebullService {

    private headers: object;
    private endpoint: string | undefined;

    constructor(
        configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.headers = { 'User-Agent': configService.get<string>('WEBULL_USER_AGENT') || '' };
        this.endpoint = configService.get<string>('WEBULL_REALTIME_ENDPOINT');
    }

    async fetchTickers(assets: AssetDTO[]): Promise<Ticker[]> {
        const externalIds = assets.map((asset: AssetDTO) => asset.externalId).join(',')
        const fullURL = `${this.endpoint}?ids=${externalIds}&includeSecu=1&delay=0&more=1&type=m1`;

        const promise = this.httpService.get(fullURL, { headers: { ...this.headers } });
        const { data } = await lastValueFrom(promise)

        return data.map((item: GetTickerResponse, index: number) => {
            const result = new Ticker();

            result.assetId = assets[index]?.id;
            
            const timestamp = new Date(item.tradeTime);
            timestamp.setSeconds(0);
            timestamp.setMilliseconds(0);
            result.timestamp = timestamp;

            result.price = item.close;

            return result
        })
    }
}
