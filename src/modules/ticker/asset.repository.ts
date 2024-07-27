import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from 'src/database/entities/asset';

@Injectable()
export class AssetRepository {
    constructor(
        @InjectRepository(Asset)
        private readonly assetRepository: Repository<Asset>,
    ) { }

    async getActiveAssetsByType(type: string): Promise<Asset[]> {
        return await this.assetRepository.find({
            where: {
                isActive: true,
                type: { name: type }
            },
            relations: ['type'],
        });
    }

    async getActiveAssets(): Promise<Asset[]> {
        return await this.assetRepository.find({
            where: { isActive: true },
        });
    }

}
