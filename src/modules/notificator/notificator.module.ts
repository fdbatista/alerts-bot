import { Module } from '@nestjs/common';
import { NotificatorService } from './notificator.service';
import { TechnicalAnalysisModule } from '../technical-analysis/technical-analysis.module';
import { TelegramService } from './telegram/telegram.service';
import { HttpModule } from '../_common/http/http.module';

@Module({
    imports: [TechnicalAnalysisModule, HttpModule],
    providers: [NotificatorService, TelegramService],
    exports: [NotificatorService],
})
export class NotificatorModule { }
