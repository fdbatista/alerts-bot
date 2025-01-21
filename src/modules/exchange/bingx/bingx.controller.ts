import { Controller, Get, Res } from '@nestjs/common';
import { BingXBalanceService } from './services/balance.service';
import { BingXTradingService } from './services/trading.service';

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

    @Get('test')
    async test(@Res() response: any) {
        // const a = await this.tradingService.placeMarketOrder(
        //     'BTC-USDT', 'BUY', 0.0001
        // );

        // const b = await this.tradingService.placeTrailingTPSLOrder(
        //     'BTC-USDT', 'BUY', 0.0001, 102200, 0.01
        // );

        response.send({  });
    }
}
