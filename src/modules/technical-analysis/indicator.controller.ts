import { Controller, Get, Version } from '@nestjs/common';
import { IndicatorService } from './indicators-builder/indicator-calculator.service';

@Controller('indicators')
export class IndicatorsController {

    constructor(
        private readonly indicatorCalculatorService: IndicatorService,
    ) { }

    @Version('1')
    @Get('')
    async test() {
        const assetId = 8;
        const intervals = [1, 5, 15, 30, 60, 180, 1440]
        const lengths = [5, 10, 20, 50];

        const indicators = await this.indicatorCalculatorService.calculateIndicators(assetId, intervals, lengths);
        console.log(indicators);
    }
}
