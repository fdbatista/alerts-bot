import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TickerService } from './modules/ticker/ticker.service';
import { TickerModule } from './modules/ticker/ticker.module';
import { IndicatorsModule } from './modules/indicator/indicators.module';
import { EnvModule } from './modules/_common/env/env.module';

@Module({
  imports: [TickerModule, IndicatorsModule, EnvModule],
  controllers: [AppController],
  providers: [AppService, TickerService],
})
export class AppModule {}
