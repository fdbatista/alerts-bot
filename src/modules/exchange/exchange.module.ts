import { Module } from '@nestjs/common';
import { BitsoModule } from './bitso/bitso.module';

@Module({
  imports: [BitsoModule],
  exports: [BitsoModule],
})
export class ExchangeModule {}
