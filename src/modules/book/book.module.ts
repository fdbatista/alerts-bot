import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BitsoModule } from '../exchange/bitso/bitso.module';
import { Book } from 'src/database/entities/book';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), BitsoModule],
  providers: [BookService],
  exports: [TypeOrmModule],
})
export class BookModule { }
