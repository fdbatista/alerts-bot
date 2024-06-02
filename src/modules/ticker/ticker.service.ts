import { Injectable } from '@nestjs/common';
import { BitsoService } from '../exchange/bitso/bitso.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { LoggerUtil } from 'src/utils/logger.util';

@Injectable()
export class TickerService {
    constructor(
        private readonly bitsoService: BitsoService,
        @InjectRepository(Ticker)
        private tickerRepository: Repository<Ticker>,
    ) { }

    async upsertTicker(): Promise<void> {
        try {
            let ticker = await this.bitsoService.getTicker('btc_usd');

            let { book, ...entityAttribs } = ticker;
            entityAttribs.bookId = 1;

            await this.tickerRepository.upsert([entityAttribs], ['bookId', 'timestamp']);
            
            LoggerUtil.log('Ticker inserted', ticker);
        } catch (error) {
            const { message } = error;
            LoggerUtil.error(message);
        }
    }
}
