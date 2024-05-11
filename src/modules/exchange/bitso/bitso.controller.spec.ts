import { Test, TestingModule } from '@nestjs/testing';
import { BitsoController } from './bitso.controller';

describe('BitsoController', () => {
  let controller: BitsoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BitsoController],
    }).compile();

    controller = module.get<BitsoController>(BitsoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
