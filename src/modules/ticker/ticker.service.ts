import { Injectable } from '@nestjs/common';
import { CandlestickDTO, TickerDTO } from '../_common/dto/ticker-dto';
import { TickerRepository } from './ticker.repository';

@Injectable()
export class TickerService {
    constructor(
        private readonly tickerRepository: TickerRepository,
    ) { }

    async getCandlesticks(assetId: number, candleDuration: number, take: number): Promise<CandlestickDTO[]> {
        const tickers = await this.tickerRepository.getCandlesticks(assetId, candleDuration, take);

        return tickers.reverse();
    }

}
