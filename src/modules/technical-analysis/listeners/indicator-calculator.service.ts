import { Injectable } from '@nestjs/common';

import { StochResult, rsi, stoch } from 'indicatorts';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RSI_CONFIG, STOCH_CONFIG } from '../_config';
import { INDICATORS_UPDATED_MESSAGE, TICKERS_INSERTED_MESSAGE } from './config';
import { LoggerUtil } from 'src/utils/logger.util';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { Asset } from 'src/database/entities/asset';
import { RsiRepository } from './rsi.repository';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';
import { StochRepository } from './stoch.repository';
import { IndicatorFactory } from './indicator-factory';
import { CandlestickDTO } from 'src/modules/_common/dto/ticker-dto';

const INDICATORS_BY_ASSET_TYPE: any = {
    Cryptocurrency: [
        { candlestick: 1, indicators: ['rsi', 'stoch'] },
        { candlestick: 5, indicators: ['rsi', 'stoch'] },
    ],
    Stock: [
        { candlestick: 1, indicators: ['stoch'] },
        { candlestick: 5, indicators: ['rsi', 'stoch'] },
    ],
    Index: [
        { candlestick: 1, indicators: ['rsi'] },
    ]
};

@Injectable()
export class IndicatorCalculatorService {

    constructor(
        private readonly tickerService: TickerService,
        private readonly rsiRepository: RsiRepository,
        private readonly stochRepository: StochRepository,
        private readonly eventEmitter: EventEmitter2
    ) { }

    @OnEvent(TICKERS_INSERTED_MESSAGE, { async: true })
    async calculateIndicators(assets: Asset[]) {
        const rsiData: Rsi[] = [];
        const stochData: Stoch[] = [];

        for (const asset of assets) {
            const assetType: string = (await asset.type).name
            const assetData: any[] = INDICATORS_BY_ASSET_TYPE[assetType];

            for (const { candlestick, indicators } of assetData) {
                const candlesticks: CandlestickDTO[] = await this.tickerService.getCandlesticks(asset.id, candlestick);
                const [{ interval_start: timestamp }] = candlesticks.slice(-1);
                const { highs, lows, closings } = this.getClosingsHighsAndLows(candlesticks);

                for (const indicator of indicators) {
                    switch (indicator) {
                        case 'rsi':
                            const rsi: number[] = this.rsi(closings);
                            const [lastRsi] = rsi.slice(-1);

                            const rsiEntity = IndicatorFactory.createRsiEntity(asset.id, timestamp, candlestick, lastRsi);
                            rsiData.push(rsiEntity);

                            break;
                        case 'stoch':
                            const stoch: StochResult = this.stoch(highs, lows, closings);
                            const [lastK] = stoch.k.slice(-1);
                            const [lastD] = stoch.d.slice(-1);

                            const stochEntity = IndicatorFactory.createStochEntity(asset.id, timestamp, candlestick, lastK, lastD);
                            stochData.push(stochEntity);

                            break;
                        default:
                            break;
                    }
                }
            }
        }

        await this.rsiRepository.upsert(rsiData);
        await this.stochRepository.upsert(stochData);

        this.eventEmitter.emit(INDICATORS_UPDATED_MESSAGE, assets);
        LoggerUtil.log(INDICATORS_UPDATED_MESSAGE);
    }

    private getClosingsHighsAndLows(candlesticks: CandlestickDTO[]) {
        const closings: number[] = [];
        const highs: number[] = [];
        const lows: number[] = [];

        for (const ticker of candlesticks) {
            highs.push(ticker.high);
            lows.push(ticker.low);
            closings.push(ticker.close);
        }

        return { highs, lows, closings };
    }

    private rsi(closings: number[]): number[] {
        return rsi(closings, RSI_CONFIG);
    }

    private stoch(highs: number[], lows: number[], closings: number[]): StochResult {
        return stoch(highs, lows, closings, STOCH_CONFIG);
    }

}
