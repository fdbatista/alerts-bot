import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from 'src/database/entities/asset';
import { Repository } from 'typeorm';

@Injectable()
export class AssetService {

    constructor(
        @InjectRepository(Asset)
        private readonly assetRepository: Repository<Asset>,
    ) { }

    async getActiveAssetsByTypeId(typeId: number): Promise<Asset[]> {
        return await this.assetRepository.find({
            where: {
                type: { id: typeId },
                isActive: true
            },
        });
    }
}
