import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { BitsoService } from './bitso.service';
import { TickerDTO } from 'src/modules/_common/dto/ticker-dto';
import { BookDTO } from 'src/modules/_common/dto/book-dto';

@Controller('bitso')
export class BitsoController {
  constructor(private readonly bitsoService: BitsoService) {}

  @Version('1')
  @Get('ticker/:symbol')
  async getTicker(@Param('symbol') symbol: string): Promise<TickerDTO> {
    return this.bitsoService.getTicker(symbol)
  }

  @Version('1')
  @Get('books')
  async getBooks(): Promise<BookDTO[]> {
    return this.bitsoService.getBooks()
  }
}
