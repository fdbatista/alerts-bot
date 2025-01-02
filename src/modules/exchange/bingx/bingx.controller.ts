import { Controller, Get, Res } from '@nestjs/common';
import { BingxService } from './bingx.service';

@Controller('bingx')
export class BingxController {
    constructor(private readonly bingxService: BingxService) { }

    @Get()
    async test(@Res() response: any) {
        const result = await this.bingxService.fetchUserBalance();
        response.send(result);
    }
}
