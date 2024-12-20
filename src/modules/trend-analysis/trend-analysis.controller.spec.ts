import { Test, TestingModule } from '@nestjs/testing';
import { TrendAnalysisController } from './trend-analysis.controller';
import { TrendAnalysisService } from './trend-analysis.service';

describe('TrendAnalysisController', () => {
  let controller: TrendAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrendAnalysisController],
      providers: [{ provide: TrendAnalysisService, useValue: {} }],
    }).compile();

    controller = module.get<TrendAnalysisController>(TrendAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
