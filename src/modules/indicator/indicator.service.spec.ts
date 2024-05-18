import { Test, TestingModule } from '@nestjs/testing';
import { IndicatorsService } from './indicator.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticker } from '../../database/entities/ticker';

describe('IndicatorsService', () => {
  let service: IndicatorsService;

  beforeEach(async () => {
    const mockedTickerRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndicatorsService,
        {
          provide: getRepositoryToken(Ticker),
          useValue: mockedTickerRepository
        },
      ],
    }).compile();
    service = module.get<IndicatorsService>(IndicatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
