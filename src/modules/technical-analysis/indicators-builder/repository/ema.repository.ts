import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ema } from 'src/database/entities/ema';

@Injectable()
export class EmaRepository {

    constructor(
        @InjectRepository(Ema)
        private readonly repository: Repository<Ema>,
    ) { }

    async upsert(data: Ema[]): Promise<void> {
        await this.repository.upsert(data, ['assetId', 'minutes', 'timestamp']);
    }

    async getLatest(assetId: number, minutes: number): Promise<Ema | null> {
        return await this.repository.findOne({
            where: { assetId, minutes },
            order: { timestamp: 'DESC' },
        });
    }

    async getLatestValues(assetId: number, minutes: number, take: number): Promise<Ema[]> {
        return await this.repository.find({
            where: { assetId, minutes },
            order: { timestamp: 'ASC' },
            take
        });
    }

}
