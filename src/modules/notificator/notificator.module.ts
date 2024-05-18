import { Module } from '@nestjs/common';
import { NotificatorService } from './notificator.service';
import { IndicatorsModule } from '../indicator/indicator.module';
import { TelegramService } from './telegram/telegram.service';
import { HttpModule } from '../_common/http/http.module';

@Module({
    imports: [IndicatorsModule, HttpModule],
    providers: [NotificatorService, TelegramService],
    exports: [NotificatorService],
})
export class NotificatorModule { }
