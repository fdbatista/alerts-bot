import { Injectable } from '@nestjs/common';

import { StochResult, rsi, stoch } from 'indicatorts';
import { OnEvent } from '@nestjs/event-emitter';
import { RSI_CONFIG, STOCH_CONFIG } from '../_config';
import { TICKERS_INSERTED_MESSAGE } from './config';
import { LoggerUtil } from 'src/utils/logger.util';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { Asset } from 'src/database/entities/asset';
import { RsiRepository } from './rsi.repository';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';
import { StochRepository } from './stoch.repository';

const INDICATORS_BY_ASSET_TYPE: any = {
    Cryptocurrency: [
        { candlestick: 1, indicators: ['stoch'] },
        { candlestick: 5, indicators: ['stoch'] },
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
    ) { }

    @OnEvent(TICKERS_INSERTED_MESSAGE, { async: true })
    async calculateIndicators(assets: Asset[]) {
        LoggerUtil.log('CALCULATING INDICATORS...');

        const rsiData: Rsi[] = [];
        const stochData: Stoch[] = [];

        for (const asset of assets) {
            const assetType: string = (await asset.type).name
            const assetData: any[] = INDICATORS_BY_ASSET_TYPE[assetType];

            for (const { candlestick, indicators } of assetData) {
                const candlesticks = await this.tickerService.getCandlesticks(asset.id, candlestick);

                const closings: number[] = [];
                const highs: number[] = [];
                const lows: number[] = [];

                for (const ticker of candlesticks) {
                    highs.push(ticker.high);
                    lows.push(ticker.low);
                    closings.push(ticker.close);
                }

                const [{ interval_start: timestamp }] = candlesticks.slice(-1);

                for (const indicator of indicators) {
                    switch (indicator) {
                        case 'rsi':
                            const rsi: number[] = this.rsi(closings);
                            const [lastRsi] = rsi.slice(-1);

                            const rsiEntity = new Rsi();
                            rsiEntity.assetId = asset.id;
                            rsiEntity.timestamp = timestamp;
                            rsiEntity.minutes = candlestick;
                            rsiEntity.value = lastRsi;

                            rsiData.push(rsiEntity);
                            break;
                        case 'stoch':
                            const stoch: StochResult = this.stoch(highs, lows, closings);
                            const [lastK] = stoch.k.slice(-1);
                            const [lastD] = stoch.d.slice(-1);

                            const stochEntity = new Stoch();
                            stochEntity.assetId = asset.id;
                            stochEntity.timestamp = timestamp;
                            stochEntity.minutes = candlestick;
                            stochEntity.k = lastK;
                            stochEntity.d = lastD;

                            stochData.push(stochEntity);
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        if (rsiData.length) {
            this.rsiRepository.upsert(rsiData);
        }

        if (stochData.length) {
            this.stochRepository.upsert(stochData);
        }
    }

    private rsi(params: any): number[] {
        const { closings } = params
        return rsi(closings, RSI_CONFIG);
    }

    private stoch(highs: number[], lows: number[], closings: number[]): StochResult {
        return stoch(highs, lows, closings, STOCH_CONFIG);
    }

}
