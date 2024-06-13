import { Test, TestingModule } from '@nestjs/testing';
import { NotificatorService } from './notificator.service';
import { TelegramService } from './telegram/telegram.service';
import { EntrypointDetectorService } from '../technical-analysis/entrypoint-detector.service';
import { HttpModule } from '../_common/http/http.module';
import { IndicatorsService } from '../technical-analysis/indicators.service';
import { PatternsService } from '../technical-analysis/patterns.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';

describe('NotificatorService', () => {
  let service: NotificatorService;

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
      imports: [
        HttpModule,
      ],
      providers: [
        NotificatorService,
        TelegramService,
        EntrypointDetectorService,
        IndicatorsService,
        PatternsService,
        {
          provide: getRepositoryToken(Ticker),
          useValue: mockedTickerRepository,
        },
      ],
    }).compile();

    service = module.get<NotificatorService>(NotificatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
