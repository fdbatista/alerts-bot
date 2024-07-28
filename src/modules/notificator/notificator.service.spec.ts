import { Test, TestingModule } from '@nestjs/testing';
import { NotificatorService } from './notificator.service';
import { TelegramService } from './telegram/telegram.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '../_common/http/http.module';

describe('NotificatorService', () => {
  let service: NotificatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot(),
        HttpModule
      ],
      providers: [
        NotificatorService,
        TelegramService,
      ],
    }).compile();

    service = module.get<NotificatorService>(NotificatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
