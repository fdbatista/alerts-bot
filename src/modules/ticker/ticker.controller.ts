import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { CandlestickDTO } from '../_common/dto/ticker-dto';
import { GetIndicatorRequestDto } from '../technical-analysis/dto/indicator.dto';

@Controller('tickers')
export class TickerController {

    constructor(
        private readonly tickerService: TickerService,
    ) { }

    @Version('1')
    @Get()
    async getPotentialEntrypoint(@Query() dto: GetIndicatorRequestDto): Promise<CandlestickDTO[]> {
        const { assetId, minutes } = dto;
        return await this.tickerService.getCandlesticks(assetId, minutes);
    }
    
}
