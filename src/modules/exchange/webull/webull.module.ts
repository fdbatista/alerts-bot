import { Module } from '@nestjs/common';
import { WebullService } from './webull.service';
import { EnvModule } from 'src/modules/_common/env/env.module';
import { HttpModule } from 'src/modules/_common/http/http.module';

@Module({
    imports: [EnvModule, HttpModule],
    providers: [WebullService],
    exports: [WebullService],
})
export class WebullModule {}
