import { Module } from '@nestjs/common';
import { NotificatorService } from './notificator.service';
import { TelegramService } from './telegram/telegram.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [NotificatorService, TelegramService],
    exports: [NotificatorService],
})
export class NotificatorModule { }
