import { Controller, Get, Version } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { EntrypointDetectorService } from './entrypoint-detector.service';

@Controller('technical-analysis')
export class TechnicalAnalysisController {
    constructor(
        private readonly indicatorService: IndicatorsService,
        private readonly entrypointDetectorService: EntrypointDetectorService,
    ) { }

    // @Version('1')
    // @Get('rsi')
    // getRSI(candlestickDuration: number): Promise<number> {
    //     // return this.indicatorService.rsi(candlestickDuration);
    //     return candlestickDuration;
    // }

    // @Version('1')
    // @Get('detection/entrypoint')
    // async getPotentialEntrypoint(): Promise<object> {
    //     return await this.entrypointDetectorService.isPotentialGoodEntrypoint();
    // }
}
