import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from 'src/database/entities/asset';
import { In, Repository } from 'typeorm';

@Injectable()
export class AssetService {

    constructor(
        @InjectRepository(Asset)
        private readonly assetRepository: Repository<Asset>,
    ) { }

    async getActiveAssetsByTypeIds(typeIds: number[]): Promise<Asset[]> {
        return await this.assetRepository.find({
            where: {
                type: { id: In(typeIds) },
                isActive: true
            },
        });
    }
}
