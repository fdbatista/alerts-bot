import { Controller, Get, Version } from '@nestjs/common';
import { IPotentialTendencyChange, IndicatorsService } from './indicators.service';
import { PatternsService } from './patterns.service';

@Controller('technical-analysis')
export class TechnicalAnalysisController {
    constructor(
        private readonly indicatorService: IndicatorsService,
        private readonly patternsService: PatternsService
        ) { }

    @Version('1')
    @Get('rsi')
    getRSI(): Promise<number[]> {
        return this.indicatorService.getRSI();
    }

    @Version('1')
    @Get('divergences')
    getPriceBreak(): Promise<IPotentialTendencyChange> {
        return this.patternsService.isPotentialDivergence();
    }
}
