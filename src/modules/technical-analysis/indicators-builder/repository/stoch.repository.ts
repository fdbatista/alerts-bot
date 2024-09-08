import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stoch } from 'src/database/entities/stoch';

@Injectable()
export class StochRepository {

    constructor(
        @InjectRepository(Stoch)
        private readonly repository: Repository<Stoch>,
    ) { }

    async upsert(data: Stoch[]): Promise<void> {
        await this.repository.upsert(data, ['assetId', 'minutes', 'timestamp']);
    }

    async getLatest(assetId: number, minutes: number): Promise<Stoch | null> {
        return await this.repository.findOne({
            where: { assetId, minutes },
            order: {
                timestamp: 'DESC'
            },
        });
    }

    async getLatestValues(assetId: number, minutes: number, take: number): Promise<Stoch[]> {
        return await this.repository.find({
            where: { assetId, minutes },
            order: { timestamp: 'ASC' },
            take
        });
    }

}
