import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stoch } from 'src/database/entities/stoch';
import { LoggerUtil } from 'src/utils/logger.util';

@Injectable()
export class StochRepository {

    constructor(
        @InjectRepository(Stoch)
        private readonly repository: Repository<Stoch>,
    ) { }

    async upsert(data: Stoch[]): Promise<void> {
        await this.repository.upsert(data, ['assetId', 'minutes', 'timestamp']);
    }

}
