import { Controller, Get, Res } from '@nestjs/common';
import { BingxService } from './bingx.service';
import { TradingService } from './trading.service';

@Controller('bingx')
export class BingxController {
    constructor(
        private readonly bingxService: BingxService,
        private readonly tradingService: TradingService,
    ) { }

    @Get('balance')
    async fetchUserBalance(@Res() response: any) {
        const result = await this.bingxService.fetchUserBalance();
        response.send(result);
    }

    @Get('fees')
    async fetchTradingFees(@Res() response: any) {
        const result = await this.bingxService.fetchTradingFees();
        response.send(result);
    }

    @Get('order')
    async placeOrder(@Res() response: any) {
        await this.tradingService.placeMarketOrder(
            'BTC-USDT', // symbol
            'BUY', // side
            0.0001 // quantity
        );

        await this.tradingService.sendTrailingStopMarketOrder(
            'BTC-USDT',
            'SELL',
            0.0001,
            1,
        );
    }
}
