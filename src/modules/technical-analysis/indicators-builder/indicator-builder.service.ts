import { Injectable } from '@nestjs/common';

import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { INDICATORS_UPDATED_MESSAGE, TICKERS_INSERTED_MESSAGE } from './config';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { Asset } from 'src/database/entities/asset';
import { RsiRepository } from './repository/rsi.repository';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';
import { StochRepository } from './repository/stoch.repository';
import { CandlestickDTO } from 'src/modules/_common/dto/ticker-dto';
import { EmaRepository } from './repository/ema.repository';
import { Ema } from 'src/database/entities/ema';
import { RsiFactory } from './indicator-factory/rsi-factory';
import { StochFactory } from './indicator-factory/stoch-factory';
import { EmaFactory } from './indicator-factory/ema-factory';

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
        { candlestick: 5, indicators: ['rsi', 'stoch', 'ema'] },
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
                            const rsiEntity: Rsi = RsiFactory.build(asset.id, timestamp, candlestick, closings);
                            rsiData.push(rsiEntity);
                            break;
                        case 'stoch':
                            const stochEntity: Stoch = StochFactory.build(asset.id, timestamp, candlestick, highs, lows, closings);
                            stochData.push(stochEntity);
                            break;
                        case 'ema':
                            const emaEntity: Ema = EmaFactory.build(asset.id, timestamp, candlestick, closings);
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

}
