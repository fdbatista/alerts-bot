import { Controller, Get, Param, Version } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { CandlestickDTO } from '../_common/dto/ticker-dto';

@Controller('tickers')
export class TickerController {

    constructor(
        private readonly tickerService: TickerService,
    ) { }

    @Version('1')
    @Get(':assetId/minutes/:minutes')
    async getPotentialEntrypoint(
        @Param('assetId') assetId: number,
        @Param('minutes') minutes: number,
    ): Promise<CandlestickDTO[]> {
        return await this.tickerService.getCandlesticks(assetId, minutes);
    }
    
}
