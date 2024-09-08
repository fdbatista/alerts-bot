import { Controller, Get, Param, Query, UseGuards, Version } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { CandlestickDTO } from '../_common/dto/ticker-dto';
import { GetIndicatorRequestDto } from '../technical-analysis/dto/get-indicator.request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tickers')
export class TickerController {

    constructor(
        private readonly tickerService: TickerService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Version('1')
    @Get()
    async getPotentialEntrypoint(@Query() dto: GetIndicatorRequestDto): Promise<CandlestickDTO[]> {
        const { assetId, minutes } = dto;
        return await this.tickerService.getCandlesticks(assetId, minutes, 30);
    }
    
}
