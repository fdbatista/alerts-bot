import { Test, TestingModule } from '@nestjs/testing';
import { IndicatorsService } from './indicator.service';

describe('IndicatorsService', () => {
  let service: IndicatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndicatorsService],
    }).compile();

    service = module.get<IndicatorsService>(IndicatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
