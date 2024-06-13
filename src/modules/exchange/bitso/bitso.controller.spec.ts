import { Test, TestingModule } from '@nestjs/testing';
import { BitsoController } from './bitso.controller';
import { BitsoService } from './bitso.service';
import { HttpModule } from 'src/modules/_common/http/http.module';
import { EnvModule } from 'src/modules/_common/env/env.module';

describe('BitsoController', () => {
  let controller: BitsoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, EnvModule],
      controllers: [BitsoController],
      providers: [BitsoService],
    }).compile();

    controller = module.get<BitsoController>(BitsoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
