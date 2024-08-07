import { Injectable } from '@nestjs/common';

import { StochResult, rsi, stoch, ema } from 'indicatorts';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EMA_CONFIG, RSI_CONFIG, STOCH_CONFIG } from '../_config';
import { INDICATORS_UPDATED_MESSAGE, TICKERS_INSERTED_MESSAGE } from './config';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { Asset } from 'src/database/entities/asset';
import { RsiRepository } from './repository/rsi.repository';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';
import { StochRepository } from './repository/stoch.repository';
import { IndicatorFactory } from './indicator-factory';
import { CandlestickDTO } from 'src/modules/_common/dto/ticker-dto';
import { EmaRepository } from './repository/ema.repository';
import { Ema } from 'src/database/entities/ema';

const INDICATORS_BY_ASSET_TYPE: any = {
    Cryptocurrency: [
        { candlestick: 1, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 5, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 15, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 30, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 60, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 180, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 360, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 720, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 1440, indicators: ['rsi', 'stoch', 'ema'] },
    ],
    Stock: [
        { candlestick: 1, indicators: ['stoch', 'ema'] },
        { candlestick: 5, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 15, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 30, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 60, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 180, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 360, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 720, indicators: ['rsi', 'stoch', 'ema'] },
        { candlestick: 1440, indicators: ['rsi', 'stoch', 'ema'] },
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
        private readonly emaRepository: EmaRepository,
        private readonly eventEmitter: EventEmitter2
    ) { }

    @OnEvent(TICKERS_INSERTED_MESSAGE, { async: true })
    async calculateIndicators(assets: Asset[]) {
        const rsiData: Rsi[] = [];
        const stochData: Stoch[] = [];
        const emaData: Ema[] = [];

        for (const asset of assets) {
            const assetType: string = (await asset.type).name
            const assetData: any[] = INDICATORS_BY_ASSET_TYPE[assetType];

            for (const { candlestick, indicators } of assetData) {
                const candlesticks: CandlestickDTO[] = await this.tickerService.getCandlesticks(asset.id, candlestick);
                const [{ interval_start: timestamp }] = candlesticks.slice(-1);
                const { highs, lows, closings } = this.getHighsLowsAndClosings(candlesticks);

                for (const indicator of indicators) {
                    switch (indicator) {
                        case 'rsi':
                            const rsiEntity: Rsi = this.buildRsiEntity(asset.id, timestamp, candlestick, closings);
                            rsiData.push(rsiEntity);
                            break;
                        case 'stoch':
                            const stochEntity: Stoch = this.buildStochEntity(asset.id, timestamp, candlestick, highs, lows, closings);
                            stochData.push(stochEntity);
                            break;
                        case 'ema':
                            const emaEntity: Ema = this.buildEma(asset.id, timestamp, candlestick, closings);
                            emaData.push(emaEntity);
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        await this.rsiRepository.upsert(rsiData);
        await this.stochRepository.upsert(stochData);
        await this.emaRepository.upsert(emaData);

        this.eventEmitter.emit(INDICATORS_UPDATED_MESSAGE, assets);
    }

    private getHighsLowsAndClosings(candlesticks: CandlestickDTO[]) {
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

    private buildRsiEntity(assetId: number, timestamp: Date, candlestick: number, closings: number[]): Rsi {
        const result: number[] = rsi(closings, RSI_CONFIG);
        const [lastRsi] = result.slice(-1);

        return IndicatorFactory.createRsiEntity(assetId, timestamp, candlestick, lastRsi);
    }

    private buildStochEntity(assetId: number, timestamp: Date, candlestick: number, highs: number[], lows: number[], closings: number[]): Stoch {
        const result: StochResult = stoch(highs, lows, closings, STOCH_CONFIG);
        const { k, d } = result;

        const [lastK] = k.slice(-1);
        const [lastD] = d.slice(-1);

        return IndicatorFactory.createStochEntity(assetId, timestamp, candlestick, lastK, lastD);
    }

    private buildEma(assetId: number, timestamp: Date, candlestick: number, closings: number[]): Ema {
        const result: number[] = ema(closings, EMA_CONFIG);
        const [lastEma] = result.slice(-1);

        return IndicatorFactory.createEmaEntity(assetId, timestamp, candlestick, lastEma);
    }

}
