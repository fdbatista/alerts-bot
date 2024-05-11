import { Controller, Get, Version } from '@nestjs/common';
import { IndicatorsService } from './indicator.service';

@Controller('indicator')
export class IndicatorController {
    constructor(private readonly indicatorService: IndicatorsService) {}

    @Version('1')
    @Get('rsi')
    getRSI(): number[] {
        return this.indicatorService.getRSI()
    }
}
