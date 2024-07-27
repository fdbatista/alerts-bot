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
        await this.repository.save(data);
    }

}
