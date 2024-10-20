import { Test, TestingModule } from '@nestjs/testing';
import { WebullService } from './webull.service';
import { EnvModule } from 'src/modules/_common/env/env.module';
import { HttpModule } from 'src/modules/_common/http/http.module';
import { Asset } from 'src/database/entities/asset';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('WebullService', () => {
  let service: WebullService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, EnvModule],
      providers: [
        WebullService,
        {
          provide: getRepositoryToken(Asset),
          useValue: {
            find: jest.fn(() => {
              return [];
            }),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<WebullService>(WebullService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
