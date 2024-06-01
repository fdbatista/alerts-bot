import { Controller, Get, Version } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { PatternsService } from './patterns.service';

@Controller('technical-analysis')
export class TechnicalAnalysisController {
    constructor(
        private readonly indicatorService: IndicatorsService,
        private readonly patternsService: PatternsService
        ) { }

    @Version('1')
    @Get('rsi')
    getRSI(candlestickDuration: number): Promise<number> {
        return this.indicatorService.rsi(candlestickDuration);
    }

    @Version('1')
    @Get('divergences')
    getPriceBreak(): Promise<boolean> {
        return this.patternsService.isPotentialBreakage();
    }
}
