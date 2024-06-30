import { Injectable } from '@nestjs/common';
import { TickerDTO, TickerRemoteResponse } from 'src/modules/_common/dto/ticker-dto';
import { EnvService } from 'src/modules/_common/env/env.service';
import { HttpService } from 'src/modules/_common/http/http.service';
import { DTOFactory } from 'src/modules/_common/dto/dto-factory';
import { Asset } from 'src/database/entities/asset';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IExchangeConnector } from '../exchange/_abstraction/exchange-connector.interface';

@Injectable()
export class WebullService implements IExchangeConnector {

    constructor(
        @InjectRepository(Asset)
        private assetRepository: Repository<Asset>,
        private readonly envService: EnvService,
        private readonly httpService: HttpService,
    ) { }

    async getTickers(): Promise<TickerDTO[]> {
        const endpoint = this.envService.getValue('WEBULL_REALTIME_ENDPOINT');
        const ids = await this.getListOfExternalAssetsIds();
        const fullURL = `${endpoint}?ids=${ids}&includeSecu=1&delay=0&more=1`;
        
        const result = await this.httpService.get(fullURL);

        return result.map((item: TickerRemoteResponse) => {    
            return DTOFactory.buildTickerDTO(item);
        })
    }

    async getListOfExternalAssetsIds(): Promise<string> {
        const assets = await this.assetRepository.find({
            select: ['externalId'],
            where: { isActive: true },
        });

        return assets.map((asset) => asset.externalId).join(',');
    }

}
