import { Injectable } from '@nestjs/common';
import { rsi } from 'indicatorts';

@Injectable()
export class IndicatorsService {
    getRSI(): number[] {
        const defaultConfig = { period: 14 };
        const result = rsi([60101.22, 60101.3, 60103.45, 60103.67, 60103.62, 60095 ], defaultConfig);

        return result
    }
}
