import { Test, TestingModule } from '@nestjs/testing';
import { BingxController } from './bingx.controller';

describe('BingxController', () => {
  let controller: BingxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BingxController],
    }).compile();

    controller = module.get<BingxController>(BingxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
