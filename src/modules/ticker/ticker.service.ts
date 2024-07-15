import { Injectable } from '@nestjs/common';
import { TickerDTO } from '../_common/dto/ticker-dto';
import { TickerRepository } from './ticker.repository';

@Injectable()
export class TickerService {
    constructor(
        private readonly tickerRepository: TickerRepository,
    ) { }

    async getTickers(assetId: number, candleDuration: number): Promise<TickerDTO[]> {
        const tickers = await this.tickerRepository.getTickers(assetId, candleDuration);

        return tickers.reverse();
    }

}
