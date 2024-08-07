import { Test, TestingModule } from '@nestjs/testing';
import { IndicatorsGateway } from './indicators.gateway';

describe('GatewayGateway', () => {
  let gateway: IndicatorsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndicatorsGateway],
    }).compile();

    gateway = module.get<IndicatorsGateway>(IndicatorsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
