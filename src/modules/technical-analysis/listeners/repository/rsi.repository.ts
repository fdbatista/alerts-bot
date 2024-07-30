import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rsi } from 'src/database/entities/rsi';

@Injectable()
export class RsiRepository {
    constructor(
        @InjectRepository(Rsi)
        private readonly repository: Repository<Rsi>,
    ) { }

    async upsert(data: Rsi[]): Promise<void> {
        await this.repository.upsert(data, ['assetId', 'minutes', 'timestamp']);
    }

    async getLatest(assetId: number, minutes: number): Promise<Rsi | null> {
        return await this.repository.findOne({
            where: { assetId, minutes },
            order: {
                timestamp: 'DESC'
            },
        });
    }

    async getValues(assetId: number, minutes: number, take: number): Promise<Rsi[]> {
        const values = await this.repository.find({
            where: { assetId, minutes },
            order: {
                timestamp: 'DESC'
            },
            take,
        });

        return values.reverse();
    }

}
