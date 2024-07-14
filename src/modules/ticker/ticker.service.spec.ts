import { Test, TestingModule } from '@nestjs/testing';
import { TickerIngesterService } from './ticker-ingester.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { Asset } from 'src/database/entities/asset';
import { WebullService } from './webull.service';
import { HttpModule } from '../_common/http/http.module';
import { EnvModule } from '../_common/env/env.module';

const mockRepository = () => {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
}

describe('TickerService', () => {
  let service: TickerIngesterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvModule, HttpModule],
      providers: [
        TickerIngesterService,
        WebullService,
        {
          provide: getRepositoryToken(Ticker),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Asset),
          useValue: mockRepository(),
        }
      ],
    }).compile();

    service = module.get<TickerIngesterService>(TickerIngesterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
