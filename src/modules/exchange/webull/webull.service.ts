import { Injectable } from '@nestjs/common';
import { TickerDTO, GetTickerResponse } from 'src/modules/_common/dto/ticker-dto';
import { DTOFactory } from 'src/modules/_common/dto/dto-factory';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

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

    async fetchTickers(externalIds: string[]): Promise<TickerDTO[]> {
        const idsJoined = externalIds.join(',');
        const fullURL = `${this.endpoint}?ids=${idsJoined}&includeSecu=1&delay=0&more=1`;

        const promise = this.httpService.get(fullURL, { headers: { ...this.headers } });
        const { data } = await lastValueFrom(promise)

        return data.map((item: GetTickerResponse) => {
            return DTOFactory.buildTickerDTO(item);
        })
    }
}
