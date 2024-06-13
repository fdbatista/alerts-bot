import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from './telegram.service';
import { HttpModule } from 'src/modules/_common/http/http.module';

describe('TelegramService', () => {
  let service: TelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [TelegramService],
    }).compile();

    service = module.get<TelegramService>(TelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
