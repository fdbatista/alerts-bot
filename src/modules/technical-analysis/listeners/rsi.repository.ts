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

}
