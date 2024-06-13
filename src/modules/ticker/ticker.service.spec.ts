import { Test, TestingModule } from '@nestjs/testing';
import { TickerService } from './ticker.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { BitsoModule } from '../exchange/bitso/bitso.module';

describe('TickerService', () => {
  let service: TickerService;

  beforeEach(async () => {
    const mockedTickerRepository = {
      find: jest.fn(() => {
        return [];
      }),
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [BitsoModule],
      providers: [
        TickerService,
        {
          provide: getRepositoryToken(Ticker),
          useValue: mockedTickerRepository,
        },
      ],
    }).compile();

    service = module.get<TickerService>(TickerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
