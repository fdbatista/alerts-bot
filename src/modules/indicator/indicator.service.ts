import { Injectable } from '@nestjs/common';
import { rsi } from 'indicatorts';
import { RSI_CONFIG } from './_config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as _ from 'lodash';

import { Ticker } from '../../database/entities/ticker';
import { DateUtil } from '../../utils/date.util';

@Injectable()
export class IndicatorsService {
    constructor(
        @InjectRepository(Ticker)
        private readonly tickerRepository: Repository<Ticker>
    ) { }

    async getRSI(): Promise<number[]> {
        const tickers = await this.getLastPrices(1);
        const groupedTickers = this.groupTickersByMinute(tickers);
        const closingPrices = this.getClosingPrices(groupedTickers);

        return rsi(closingPrices, RSI_CONFIG);
    }

    async getLastPrices(bookId: number): Promise<Ticker[]> {
        const result = await this.tickerRepository.find({
            select: ['last', 'timestamp'],
            where: { bookId },
            order: { timestamp: 'desc' },
            take: 720,
        });

        return result.reverse();
    }

    groupTickersByMinute(tickers: Ticker[]): _.Dictionary<Ticker[]> {
        return _.groupBy(tickers, (ticker) => {
            const { timestamp } = ticker

            return DateUtil.formatDateUntilMinutes(timestamp);
        })
    }

    getClosingPrices(groupedTickers: _.Dictionary<Ticker[]>): number[] {
        return Object.entries(groupedTickers).map(([, tickers]) => {
            const lastItem = _.last(tickers)
            return lastItem?.last ?? 0
        }).filter(item => item > 0)

    }
}
