import { Injectable } from '@nestjs/common';
import { rsi } from 'indicatorts';
import { RSI_CONFIG } from './_config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Ticker } from '../../database/entities/ticker';
import { TechnicalAnalyzerAbstract } from './technical-analyzer.abstract';

export interface IPotentialTendencyChange {
    bullish: boolean
    bearish: boolean
}

@Injectable()
export class IndicatorsService extends TechnicalAnalyzerAbstract {
    constructor(
        @InjectRepository(Ticker)
        tickerRepository: Repository<Ticker>
    ) {
        super(tickerRepository);
    }

    async getRSI(): Promise<number[]> {
        const tickers = await this.getLastPrices(1, 720);
        const groupedTickers = this.groupTickersByMinute(tickers);
        const closingPrices = this.getClosingPrices(groupedTickers);

        return rsi(closingPrices, RSI_CONFIG);
    }
}
