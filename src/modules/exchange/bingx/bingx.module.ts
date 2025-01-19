import { Module } from '@nestjs/common';
import { BingxController } from './bingx.controller';
import { HttpModule } from '@nestjs/axios';
import { TradingService } from './trading.service';

@Module({
  imports: [HttpModule],
  controllers: [BingxController],
  providers: [TradingService],
})
export class BingxModule { }
