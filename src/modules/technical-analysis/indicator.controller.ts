import { Controller, Get, UseGuards, Version } from '@nestjs/common';
import { IndicatorCalculatorService } from './indicators-builder/indicator-calculator.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('indicators')
export class IndicatorsController {

    constructor(
        private readonly indicatorCalculatorService: IndicatorCalculatorService,
    ) { }

    // @UseGuards(JwtAuthGuard)
    @Version('1')
    @Get()
    async getIndicators() {
        return await this.indicatorCalculatorService.getIntervalsData(8);
    }
}
