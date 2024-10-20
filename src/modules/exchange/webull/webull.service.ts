import { Injectable } from '@nestjs/common';
import { TickerDTO, TickerRemoteResponse } from 'src/modules/_common/dto/ticker-dto';
import { EnvService } from 'src/modules/_common/env/env.service';
import { HttpService } from 'src/modules/_common/http/http.service';
import { DTOFactory } from 'src/modules/_common/dto/dto-factory';

interface IHeaders {
    'User-Agent': string,
}

@Injectable()
export class WebullService {

    private headers: IHeaders

    constructor(
        private readonly envService: EnvService,
        private readonly httpService: HttpService,
    ) {
        this.headers = {
            'User-Agent': envService.getValue('WEBULL_USER_AGENT')
        }
    }

    async fetchTickers(ids: string[]): Promise<TickerDTO[]> {
        const endpoint = this.envService.getValue('WEBULL_REALTIME_ENDPOINT');
        const idsJoined = ids.join(',');
        const fullURL = `${endpoint}?ids=${idsJoined}&includeSecu=1&delay=0&more=1`;

        const result = await this.httpService.get(fullURL, this.headers);

        return result.map((item: TickerRemoteResponse) => {
            return DTOFactory.buildTickerDTO(item);
        })
    }
}
