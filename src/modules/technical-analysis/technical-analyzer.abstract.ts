import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as _ from 'lodash';

import { Ticker } from '../../database/entities/ticker';
import { DateUtil } from '../../utils/date.util';

export interface IPotentialTendencyChange {
    bullish: boolean
    bearish: boolean
}

@Injectable()
export abstract class TechnicalAnalyzerAbstract {
    constructor(
        @InjectRepository(Ticker)
        protected readonly tickerRepository: Repository<Ticker>
    ) { }

    protected async getLastPrices(bookId: number, count: number): Promise<Ticker[]> {
        const result = await this.tickerRepository.find({
            select: ['last', 'timestamp'],
            where: { bookId },
            order: { timestamp: 'desc' },
            take: count,
        });

        return result.reverse();
    }

    protected getClosingPrices(groupedTickers: _.Dictionary<Ticker[]>): number[] {
        return Object.entries(groupedTickers).map(([, tickers]) => {
            const lastItem = _.last(tickers)
            return lastItem?.last ?? 0
        }).filter(item => item > 0)

    }

    protected groupTickersByMinute(tickers: Ticker[]): _.Dictionary<Ticker[]> {
        return _.groupBy(tickers, (ticker) => {
            const { timestamp } = ticker

            return DateUtil.formatDateUntilMinutes(timestamp);
        })
    }
}
