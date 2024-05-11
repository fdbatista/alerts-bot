import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndicatorsModule } from './modules/indicator/indicators.module';
import { EnvModule } from './modules/_common/env/env.module';
import { BitsoModule } from './modules/exchange/bitso/bitso.module';
import { BitsoService } from './modules/exchange/bitso/bitso.service';
import { HttpService } from './modules/_common/http/http.service';

@Module({
  imports: [IndicatorsModule, EnvModule, BitsoModule],
  controllers: [AppController],
  providers: [AppService, BitsoService, HttpService],
})
export class AppModule {}
