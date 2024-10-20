import { Module } from '@nestjs/common';
import { WebullModule } from './webull/webull.module';
import { BingxModule } from './bingx/bingx.module';

@Module({
  imports: [WebullModule, BingxModule]
})
export class ExchangeModule {}
