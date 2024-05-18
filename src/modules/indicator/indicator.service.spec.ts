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

  it('Should detect all max peaks', () => {
    const prices = [
      67113, 67113, 67110, 67105, 67123, 67077, 67077, 67090, 67100, 67020, 67030, 67040, 67010, 66990, 67115, 67150
    ];

    const detectedPeaks = service.findMaxPeaks(prices);
    const expectedPeaks = [67123, 67100, 67040];

    expect(detectedPeaks).toEqual(expectedPeaks);
  });
});
