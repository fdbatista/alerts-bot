import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { BitsoModule } from '../exchange/bitso/bitso.module';
import { EnvModule } from '../_common/env/env.module';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BookController } from './book.controller';
import { Book } from 'src/database/entities/book';

describe('BookService', () => {
  let service: BookService;

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
      imports: [EnvModule, BitsoModule],
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockedBookRepository
        },
      ],
      controllers: [BookController],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
