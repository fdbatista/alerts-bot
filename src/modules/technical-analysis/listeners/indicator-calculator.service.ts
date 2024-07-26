import { Injectable } from '@nestjs/common';

import { StochResult, rsi, stoch } from 'indicatorts';
import { OnEvent } from '@nestjs/event-emitter';
import { RSI_CONFIG, STOCH_CONFIG } from '../_config';
import { TICKERS_INSERTED_MESSAGE } from './config';
import { LoggerUtil } from 'src/utils/logger.util';

@Injectable()
export class IndicatorCalculatorService {

    @OnEvent(TICKERS_INSERTED_MESSAGE, { async: true })
    calculateRSI() {
        LoggerUtil.log('CALCULATING RSI...');
    }

    rsi(closings: number[]): number[] {
        return rsi(closings, RSI_CONFIG);
    }

    stoch(highs: number[], lows: number[], closings: number[]): StochResult {
        return stoch(highs, lows, closings, STOCH_CONFIG);
    }

}
