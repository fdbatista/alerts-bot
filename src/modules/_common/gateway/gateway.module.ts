import { Module } from '@nestjs/common';
import { IndicatorsGateway } from './indicators.gateway';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [IndicatorsGateway],
  exports: [IndicatorsGateway],
})
export class GatewayModule { }
