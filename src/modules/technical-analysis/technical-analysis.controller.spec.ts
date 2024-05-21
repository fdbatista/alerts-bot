import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalAnalysisController } from './technical-analysis.controller';

describe('IndicatorController', () => {
  let controller: TechnicalAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnicalAnalysisController],
    }).compile();

    controller = module.get<TechnicalAnalysisController>(TechnicalAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
