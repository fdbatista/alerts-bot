import { Module } from '@nestjs/common';
import { BingxController } from './bingx.controller';
import { BingxService } from './bingx.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [BingxController],
  providers: [BingxService]
})
export class BingxModule {}
