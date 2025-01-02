import { Controller, Get } from '@nestjs/common';
import { BingxService } from './bingx.service';

@Controller('bingx')
export class BingxController {
    constructor(private readonly bingxService: BingxService) {}

    @Get()
    async test() {
        return await this.bingxService.getUserBalance()
    }
}
