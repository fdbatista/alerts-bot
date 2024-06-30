import { Injectable } from '@nestjs/common';
import { TickerDTO, TickerRemoteResponse } from 'src/modules/_common/dto/ticker-dto';
import { EnvService } from 'src/modules/_common/env/env.service';
import { HttpService } from 'src/modules/_common/http/http.service';
import { DTOFactory } from 'src/modules/_common/dto/dto-factory';
import { Asset } from 'src/database/entities/asset';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WebullService {

    constructor(
        @InjectRepository(Asset)
        private assetRepository: Repository<Asset>,
        private readonly envService: EnvService,
        private readonly httpService: HttpService,
    ) { }

    async getTickers(ids: string[]): Promise<TickerDTO[]> {
        const endpoint = this.envService.getValue('WEBULL_REALTIME_ENDPOINT');
        const idsJoined = ids.join(',');
        const fullURL = `${endpoint}?ids=${idsJoined}&includeSecu=1&delay=0&more=1`;

        const headers = {
            'User-Agent': this.envService.getValue('WEBULL_USER_AGENT'),
        }

        const result = await this.httpService.get(fullURL, headers);

        return result.map((item: TickerRemoteResponse) => {
            return DTOFactory.buildTickerDTO(item);
        })
    }

    async getExternalIdsOfActiveAssets(): Promise<string[]> {
        const assets = await this.getActiveAssets();
        return assets.map((asset: Asset) => asset.externalId)
    }

    async getExternalIdsOfActiveAssetsByType(type: string): Promise<string[]> {
        const assets = await this.getActiveAssets();

        const result = []

        for (const asset of assets) {
            const typeEntity = await asset.type;
            const { name } = typeEntity

            if (name === type) {
                result.push(asset.externalId)
            }
        }
        
        return result;
    }

    private async getActiveAssets(): Promise<Asset[]> {
        return await this.assetRepository.find({
            where: { isActive: true },
            relations: ['type'],
        });
    }

}
