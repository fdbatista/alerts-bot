import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from 'src/database/entities/asset';
import { AssetDTO } from './dto/asset.dto';

const ASSET_QUERY = `
    select
        a.id,
        a.external_id as "externalId",
        a.symbol,
        t.id as "typeId",
        t.name as "typeName"
    from asset a
        inner join asset_type t on (a.type_id = t.id)
    where is_active is true`

const ASSET_BY_TYPE_FILTER = ' and t.name = $1'

@Injectable()
export class AssetRepository {
    constructor(
        @InjectRepository(Asset)
        private readonly assetRepository: Repository<Asset>,
    ) { }

    async getActiveAssets(type?: string): Promise<AssetDTO[]> {
        const query = `${ASSET_QUERY}${type ? ASSET_BY_TYPE_FILTER : ''}`; 
        return await this.assetRepository.query(query, [type]);
    }
}
