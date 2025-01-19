import { Controller, Get, Res } from '@nestjs/common';
import { BingXBalanceService } from './services/balance.service';

@Controller('bingx')
export class BingxController {
    constructor(
        private readonly balanceService: BingXBalanceService,
    ) { }

    @Get('balance')
    async fetchUserBalance(@Res() response: any) {
        const result = await this.balanceService.fetchUserBalance();
        response.send(result);
    }
}
