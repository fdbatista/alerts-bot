import { Module } from '@nestjs/common';
import { BingxController } from './bingx.controller';
import { BingxService } from './bingx.service';
import { HttpModule } from '@nestjs/axios';
import { TradingService } from './trading.service';

@Module({
  imports: [HttpModule],
  controllers: [BingxController],
  providers: [BingxService, TradingService],
})
export class BingxModule {}
