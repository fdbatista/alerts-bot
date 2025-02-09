import { Controller, Get, Query, Res } from '@nestjs/common';
import { BingXBalanceService } from './services/balance.service';
import { BingXPositionsService } from './services/positions.service';

@Controller('bingx')
export class BingxController {
    constructor(
        private readonly balanceService: BingXBalanceService,
        private readonly ledgerService: BingXPositionsService,

    ) { }

    @Get('balance')
    async fetchUserBalance(@Res() response: any) {
        const result = await this.balanceService.fetchUserBalance();
        response.send(result);
    }

    @Get('positions/open')
    async getOpenOrders(@Query('symbol') symbol: string, @Res() response: any) {
        const result = await this.ledgerService.fetchOpenPositions(symbol);
        response.send(result);
    }

    @Get('test')
    async test(@Res() response: any) {
        response.send({});
    }
}
