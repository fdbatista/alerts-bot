import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { BitsoService } from './bitso.service';

@Controller('bitso')
export class BitsoController {
  constructor(private readonly bitsoService: BitsoService) {}

  @Version('1')
  @Get('ticker/:symbol')
  async getTicker(@Param('symbol') symbol: string): Promise<object> {
    return this.bitsoService.getTicker(symbol)
  }
}
