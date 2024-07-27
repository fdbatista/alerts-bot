import { Injectable } from '@nestjs/common';

import { StochResult, rsi, stoch } from 'indicatorts';
import { OnEvent } from '@nestjs/event-emitter';
import { RSI_CONFIG, STOCH_CONFIG } from '../_config';
import { TICKERS_INSERTED_MESSAGE } from './config';
import { LoggerUtil } from 'src/utils/logger.util';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { Asset } from 'src/database/entities/asset';

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

    constructor(private readonly tickerService: TickerService) { }

    @OnEvent(TICKERS_INSERTED_MESSAGE, { async: true })
    async calculateIndicators(assets: Asset[]) {
        LoggerUtil.log('CALCULATING INDICATORS...');

        for (const asset of assets) {
            const assetType: string = (await asset.type).name
            const assetData: any[] = INDICATORS_BY_ASSET_TYPE[assetType];

            for (const { indicators, candlestick } of assetData) {
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
                            break;
                        case 'stoch':
                            const stoch: StochResult = this.stoch(highs, lows, closings);
                            const [lastK] = stoch.k.slice(-1);
                            const [lastD] = stoch.d.slice(-1);
                            break;
                        default:
                            break;
                    }
                }
            }
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
