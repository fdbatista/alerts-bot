import { Controller, Get, Version } from '@nestjs/common';
import { IndicatorsService } from './indicator.service';

@Controller('indicators')
export class IndicatorController {
    constructor(private readonly indicatorService: IndicatorsService) { }

    @Version('1')
    @Get('rsi')
    getRSI(): Promise<number[]> {
        return this.indicatorService.getRSI();
    }

    @Version('1')
    @Get('price-break')
    getPriceBreak(): Promise<boolean> {
        return this.indicatorService.isPotentialPriceBreakUp();
    }
}
