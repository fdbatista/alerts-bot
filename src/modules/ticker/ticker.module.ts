import { Module } from '@nestjs/common';
import { TickerService } from './ticker.service';

@Module({
  providers: [TickerService]
})
export class TickerModule {}
