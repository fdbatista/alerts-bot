import { Controller, Get, Res } from '@nestjs/common';
import { BingXTradingService } from './services/trading.service';
import { BingXBalanceService } from './services/balance.service';

@Controller('bingx')
export class BingxController {
    constructor(
        private readonly tradingService: BingXTradingService,
        private readonly balanceService: BingXBalanceService,
    ) { }

    @Get('balance')
    async fetchUserBalance(@Res() response: any) {
        const result = await this.balanceService.fetchUserBalance();
        response.send(result);
    }

    @Get('order')
    async placeOrder(@Res() response: any) {
        const result = await this.tradingService.placeMarketOrderWithTrailingStop('BTC-USDT', 'BUY', 0.0001);
        response.send(result);
    }
}
