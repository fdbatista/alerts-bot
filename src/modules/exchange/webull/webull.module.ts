import { Module } from '@nestjs/common';
import { WebullService } from './webull.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [WebullService],
    exports: [WebullService],
})
export class WebullModule { }
