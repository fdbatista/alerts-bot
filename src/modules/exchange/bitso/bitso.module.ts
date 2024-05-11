import { Module } from '@nestjs/common';
import { BitsoService } from './bitso.service';
import { EnvModule } from 'src/modules/_common/env/env.module';
import { HttpService } from 'src/modules/_common/http/http.service';
import { BitsoController } from './bitso.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), EnvModule],
  providers: [BitsoService, HttpService],
  exports: [BitsoService],
  controllers: [BitsoController],
})
export class BitsoModule {}
