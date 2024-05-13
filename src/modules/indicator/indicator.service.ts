import { Injectable } from '@nestjs/common';
import { rsi } from 'indicatorts';
import { RSI_CONFIG } from './_config';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { format } from 'date-fns';

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

            return format(timestamp, 'yyyy-MM-dd HH:mm');

            // const year = timestamp.getFullYear();
            // const month = ('0' + (timestamp.getMonth() + 1)).slice(-2);
            // const day = ('0' + timestamp.getDate()).slice(-2);
            // const hours = ('0' + timestamp.getHours()).slice(-2);
            // const minutes = ('0' + timestamp.getMinutes()).slice(-2);

            // const date = `${year}-${month}-${day} ${hours}:${minutes}`;

            // return date
        })
    }

    getClosingPrices(groupedTickers: _.Dictionary<Ticker[]>): number[] {
        return Object.entries(groupedTickers).map(([, tickers]) => {
            const lastItem = _.last(tickers)
            return lastItem?.last ?? 0
        }).filter(item => item > 0)

    }
}
