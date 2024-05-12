import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BitsoModule } from '../exchange/bitso/bitso.module';
import { Book } from 'src/database/entities/book';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), BitsoModule],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule { }
