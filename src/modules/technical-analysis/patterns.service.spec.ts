import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticker } from '../../database/entities/ticker';
import { PatternsService } from './patterns.service';

describe('PatternsService', () => {
  let service: PatternsService;

  beforeEach(async () => {
    const mockedTickerRepository = {
      find: jest.fn(() => {
        return [
          { timestamp: new Date('2024-05-20 23:55:00'), last: 66980 },
          { timestamp: new Date('2024-05-20 23:54:00'), last: 67113 },
          { timestamp: new Date('2024-05-20 23:53:00'), last: 67110 },
          { timestamp: new Date('2024-05-20 23:52:00'), last: 67105 },
          { timestamp: new Date('2024-05-20 23:51:00'), last: 67123 },
          { timestamp: new Date('2024-05-20 23:50:00'), last: 67077 },
          { timestamp: new Date('2024-05-20 23:49:00'), last: 67077 },
          { timestamp: new Date('2024-05-20 23:48:00'), last: 67090 },
          { timestamp: new Date('2024-05-20 23:47:00'), last: 67100 },
          { timestamp: new Date('2024-05-20 23:46:00'), last: 67020 },
          { timestamp: new Date('2024-05-20 23:45:00'), last: 67030 },
          { timestamp: new Date('2024-05-20 23:44:00'), last: 67040 },
          { timestamp: new Date('2024-05-20 23:43:00'), last: 67010 },
          { timestamp: new Date('2024-05-20 23:42:00'), last: 66990 },
          { timestamp: new Date('2024-05-20 23:41:00'), last: 67115 },
          { timestamp: new Date('2024-05-20 23:40:00'), last: 67114 },
        ];
      }),
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatternsService,
        {
          provide: getRepositoryToken(Ticker),
          useValue: mockedTickerRepository
        },
      ],
    }).compile();

    service = module.get<PatternsService>(PatternsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should detect all max peaks', () => {
    const prices = [
      67113, 67113, 67110, 67105, 67123, 67077, 67077, 67090, 67100, 67020, 67030, 67040, 67010, 66990, 67115, 67150
    ];

    const result = service.findMaxPeaks(prices);
    const expectedResult = [67123, 67100, 67040];

    expect(result).toEqual(expectedResult);
  });

  it('Should detect that current price is over last peak', () => {
    const peaks = [67123, 67100, 67040];
    const lastPrice = 67150;

    const result = service.isCurrentPriceOverLastPeak(peaks, lastPrice);

    expect(result).toBe(true);
  });

  it('Should calculate the next point in the trend line', async () => {
    const peaks = [67123, 67100, 67040];
    const result = service.calculateNextPointInTendencyLine(peaks);

    expect(result).toBe(66980);
  });

  it('Should detect that current price is over the trend line', async () => {
    const closingPrices = [67113, 67113, 67110, 67105, 67123, 67077, 67077, 67090, 67100, 67020, 67030, 67040, 67010, 66990, 67030];
    const result = service.isCurrentPriceOverTrendLine(closingPrices);

    expect(result).toBe(true);
  });
});
