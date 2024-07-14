import { Injectable } from '@nestjs/common';
import { RSI_CONFIG } from './_config';

import { stoch, rsi, StochResult } from 'indicatorts';

const STOCH_CONFIG = { kPeriod: 14, dPeriod: 3 };

@Injectable()
export class IndicatorsService {
    rsi(closings: number[]): number[] {
        return rsi(closings, RSI_CONFIG);
    }

    stoch(highs: number[], lows: number[], closings: number[]): StochResult {
        return stoch(highs, lows, closings, STOCH_CONFIG);
    }
}
