import { Module } from '@nestjs/common';
import { BingxController } from './bingx.controller';
import { HttpModule } from '@nestjs/axios';
import { BingXBalanceService } from './services/balance.service';
import { BingXTradingService } from './services/trading.service';
import { BingXPositionsService } from './services/positions.service';

@Module({
  imports: [HttpModule],
  controllers: [BingxController],
  providers: [BingXBalanceService, BingXTradingService, BingXPositionsService],
})
export class BingxModule { }
