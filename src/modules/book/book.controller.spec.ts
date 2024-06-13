import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from 'src/database/entities/book';
import { BitsoModule } from '../exchange/bitso/bitso.module';

describe('BookController', () => {
  let controller: BookController;

  beforeEach(async () => {
    const mockedBookRepository = {
      find: jest.fn(() => {
        return [];
      }),
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [BitsoModule],
      controllers: [BookController],
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockedBookRepository,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
