import { Controller, Get, Query } from '@nestjs/common';
import { TrendAnalysisService } from './trend-analysis.service';

@Controller('trend-analysis')
export class TrendAnalysisController {
    constructor(private readonly trendAnalysisService: TrendAnalysisService) { }

    @Get('bearish')
    analyzeBearishTrend(@Query('data') data: string) {
        const closingPrices = JSON.parse(data);
        return this.trendAnalysisService.analyzeBearishTrend(closingPrices);
    }

    @Get('sma-crossovers')
    detectSMACrossovers(@Query('data') data: string) {
        const closingPrices = JSON.parse(data);
        return this.trendAnalysisService.detectSMACrossovers(closingPrices);
    }
}
