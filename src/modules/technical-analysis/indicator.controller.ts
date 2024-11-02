import { Controller, Get, UseGuards, Version } from '@nestjs/common';
import { IndicatorService } from './indicators-builder/indicator-calculator.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('indicators')
export class IndicatorsController {

    constructor(
        private readonly indicatorCalculatorService: IndicatorService,
    ) { }

    // @UseGuards(JwtAuthGuard)
    @Version('1')
    @Get()
    async test() {
        const assetId = 8;
        // const intervals = [1, 5, 15, 30, 60, 180, 1440]
        const intervals = [1]
        const smaLengths = [10, 50, 200];
        const emaLengths = [45, 200];

        return await this.indicatorCalculatorService.calculateIndicators(assetId, intervals, smaLengths, emaLengths);
    }
}
