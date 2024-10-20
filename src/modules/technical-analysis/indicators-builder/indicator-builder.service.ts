import { Injectable } from '@nestjs/common';

import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RUN_TECHNICAL_ANALYSIS, BUILD_INDICATORS, BROADCAST_TECHNICAL_DATA } from './config';
import { RsiRepository } from './repository/rsi.repository';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';
import { StochRepository } from './repository/stoch.repository';
import { CandlestickDTO } from 'src/modules/_common/dto/ticker-dto';
import { EmaRepository } from './repository/ema.repository';
import { Ema } from 'src/database/entities/ema';
import { TechnicalAnalysisDTO } from './indicators-updated-payload.dto';
import { TickerInsertedDTO } from 'src/modules/ticker/dto/ticker-inserted.dto';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { IndicatorFactory } from './indicator-factory';

@Injectable()
export class IndicatorCalculatorService {

    constructor(
        private readonly tickerService: TickerService,
        private readonly rsiRepository: RsiRepository,
        private readonly stochRepository: StochRepository,
        private readonly emaRepository: EmaRepository,
        private readonly eventEmitter: EventEmitter2
    ) { }

    @OnEvent(BUILD_INDICATORS, { async: true })
    async calculateIndicators(payload: TickerInsertedDTO) {
        const rsiData: Rsi[] = [];
        const stochData: Stoch[] = [];
        const emaData: Ema[] = [];

        const { assets, tickers } = payload

        // for (const asset of assets) {
            
        //     const assetData: any[] = INDICATORS_BY_ASSET_TYPE[asset.typeName];

        //     for (const { candlestick, indicators } of assetData) {
        //         const candlesticks: CandlestickDTO[] = await this.tickerService.getCandlesticks(asset.id, candlestick, 30);
        //         const [{ interval_start: timestamp }] = candlesticks.slice(-1);
        //         const { highs, lows, closings } = this.getHighsLowsAndClosings(candlesticks);

        //         for (const indicator of indicators) {
        //             switch (indicator) {
        //                 case 'rsi':
        //                     const rsiEntity: Rsi = IndicatorFactory.rsi(asset.id, timestamp, candlestick, closings);
        //                     rsiData.push(rsiEntity);
        //                     break;
        //                 case 'stoch':
        //                     const stochEntity: Stoch = IndicatorFactory.stoch(asset.id, timestamp, candlestick, highs, lows, closings);
        //                     stochData.push(stochEntity);
        //                     break;
        //                 case 'ema':
        //                     const emaEntity: Ema = IndicatorFactory.ema(asset.id, timestamp, candlestick, closings);
        //                     emaData.push(emaEntity);
        //                     break;
        //                 default:
        //                     break;
        //             }
        //         }
        //     }
        // }

        // await this.rsiRepository.upsert(rsiData);
        // await this.stochRepository.upsert(stochData);
        // await this.emaRepository.upsert(emaData);

        // this.eventEmitter.emit(RUN_TECHNICAL_ANALYSIS, assets);

        // const eventPayload = new TechnicalAnalysisDTO(assets, tickers, rsiData, stochData, emaData);
        // this.eventEmitter.emit(BROADCAST_TECHNICAL_DATA, eventPayload);
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
