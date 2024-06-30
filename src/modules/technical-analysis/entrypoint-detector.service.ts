import { Injectable } from '@nestjs/common';

import { IndicatorsService } from './indicators.service';
import { PatternsService } from './patterns.service';

export interface PotentialEntrypoint {
    isPotentialBreak: boolean;
    isGoodStochSignal: boolean;
}

@Injectable()
export class EntrypointDetectorService {
    constructor(
        private readonly indicatorService: IndicatorsService,
        private readonly patternsService: PatternsService,
    ) { }

    async isPotentialGoodEntrypoint(): Promise<PotentialEntrypoint> {
        const isPotentialBreak = await this.patternsService.isPotentialBreak();
        
        const stoch = await this.indicatorService.stoch(5);
        const [lastStoch] = stoch.slice(-1);
        const { K: kValue, D: dValue } = lastStoch ?? {};

        const isGoodStochSignal = dValue <= 20 && kValue <= 20;

        return { isPotentialBreak, isGoodStochSignal };
    }
}
