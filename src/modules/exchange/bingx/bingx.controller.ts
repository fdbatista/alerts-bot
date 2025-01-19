import { Controller, Get, Res } from '@nestjs/common';
import { TradingService } from './trading.service';

@Controller('bingx')
export class BingxController {
    constructor(
        private readonly tradingService: TradingService,
    ) { }

    @Get('balance')
    async fetchUserBalance(@Res() response: any) {
        const result = await this.tradingService.fetchUserBalance();
        response.send(result);
    }

    @Get('order')
    async placeOrder(@Res() response: any) {
        const result = await this.tradingService.placeMarketOrderWithTrailingStop('BTC-USDT', 'BUY', 0.0001);
        response.send(result);  
    }
}
