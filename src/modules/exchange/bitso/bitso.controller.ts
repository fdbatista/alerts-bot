import { Controller, Get, Param, Version } from '@nestjs/common';
import { BitsoService } from './bitso.service';
import { TickerDTO } from 'src/modules/_common/dto/ticker-dto';
import { BookDTO } from 'src/modules/_common/dto/book-dto';

@Controller('bitso')
export class BitsoController {
  constructor(private readonly bitsoService: BitsoService) {}

  @Version('1')
  @Get('ticker')
  async getTicker(): Promise<TickerDTO[]> {
    return await this.bitsoService.getTickers()
  }

  @Version('1')
  @Get('books')
  async getBooks(): Promise<BookDTO[]> {
    return await this.bitsoService.getBooks()
  }
}
