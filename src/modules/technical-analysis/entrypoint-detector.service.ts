import { Injectable } from '@nestjs/common';

import { IndicatorsService } from './indicators.service';
import { PatternsService } from './patterns.service';

export interface PotentialEntrypoint {
    isPotentialBreakage: boolean;
    isGoodStochSignal: boolean;
}

@Injectable()
export class EntrypointDetectorService {
    constructor(
        private readonly indicatorService: IndicatorsService,
        private readonly patternsService: PatternsService,
    ) { }

    async isPotentialGoodEntrypoint(): Promise<PotentialEntrypoint> {
        const isPotentialBreakage = await this.patternsService.isPotentialBreakage();
        const stoch = await this.indicatorService.stoch(5);

        const [lastStoch] = stoch.slice(-1);

        const isGoodStochSignal =
            lastStoch.D <= 20
            && lastStoch.K <= 20

        return { isPotentialBreakage, isGoodStochSignal };
    }
}
