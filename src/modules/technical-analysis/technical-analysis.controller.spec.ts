import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalAnalysisController } from './technical-analysis.controller';
import { IndicatorsService } from './indicators.service';
import { EntrypointDetectorService } from './entrypoint-detector.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { PatternsService } from './patterns.service';

describe('TechnicalAnalysisController', () => {
  let controller: TechnicalAnalysisController;

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
      controllers: [TechnicalAnalysisController],
      providers: [
        IndicatorsService,
        EntrypointDetectorService,
        PatternsService,
        {
          provide: getRepositoryToken(Ticker),
          useValue: mockedTickerRepository,
        },
      ],
    }).compile();

    controller = module.get<TechnicalAnalysisController>(TechnicalAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
