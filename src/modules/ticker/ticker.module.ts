import { Module } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitsoModule } from '../exchange/bitso/bitso.module';
import { Ticker } from 'src/database/entities/ticker';

@Module({
  imports: [TypeOrmModule.forFeature([Ticker]), BitsoModule],
  providers: [TickerService]
})
export class TickerModule {}
