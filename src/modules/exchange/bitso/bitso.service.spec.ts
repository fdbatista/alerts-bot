import { Test, TestingModule } from '@nestjs/testing';
import { BitsoService } from './bitso.service';
import { HttpModule } from 'src/modules/_common/http/http.module';
import { EnvModule } from 'src/modules/_common/env/env.module';

describe('BitsoService', () => {
  let service: BitsoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, EnvModule],
      providers: [BitsoService],
    }).compile();

    service = module.get<BitsoService>(BitsoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
