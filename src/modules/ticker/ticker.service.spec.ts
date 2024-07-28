import { Test, TestingModule } from '@nestjs/testing';
import { TickerIngesterService } from './ticker-ingester.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';
import { Asset } from 'src/database/entities/asset';
import { WebullService } from './webull.service';
import { HttpModule } from '../_common/http/http.module';
import { EnvModule } from '../_common/env/env.module';
import { TickerService } from './ticker.service';
import { TickerRepository } from './ticker.repository';
import { AssetRepository } from './asset.repository';
import { TickerSchedulerService } from './ticker-scheduler.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

const mockRepository = () => {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
}

describe('TickerService', () => {
  let service: TickerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EnvModule,
        HttpModule,
        EventEmitterModule.forRoot()
      ],
      providers: [
        TickerSchedulerService,
        WebullService,
        TickerService,
        TickerIngesterService,
        WebullService,
        TickerRepository,
        AssetRepository,
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

    service = module.get<TickerService>(TickerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
