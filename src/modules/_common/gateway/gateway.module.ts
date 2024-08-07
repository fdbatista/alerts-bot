import { Module } from '@nestjs/common';
import { GatewayService } from './subscriber-example.service';
import { IndicatorsGateway } from './indicators.gateway';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [GatewayService, IndicatorsGateway],
  exports: [GatewayService, IndicatorsGateway],
})
export class GatewayModule { }
