import { Injectable } from '@nestjs/common';
import { BitsoService } from '../exchange/bitso/bitso.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/database/entities/book';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
    constructor(
        private readonly bitsoService: BitsoService,
        // @InjectRepository(Book) 
        // private bookRepository: Repository<Book>,
    ) { }

    async upsertBooks(): Promise<void> {
        const books = await this.bitsoService.getBooks()
        // await this.bookRepository.upsert(books, ['name'])
    }
}
