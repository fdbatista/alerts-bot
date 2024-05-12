import { Controller, Get, Version } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Version('1')
    @Get('/')
    async getBooks(): Promise<void> {
      await this.bookService.upsertBooks()
    }
}
