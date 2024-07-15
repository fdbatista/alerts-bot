import { Controller, Get, Version } from '@nestjs/common';
import { EntrypointDetectorService } from './entrypoint-detector.service';

@Controller('technical-analysis')
export class TechnicalAnalysisController {
    constructor(
        private readonly entrypointDetectorService: EntrypointDetectorService,
    ) { }

    @Version('1')
    @Get('detection/entrypoint')
    async getPotentialEntrypoint(): Promise<object> {
        return await this.entrypointDetectorService.isPotentialGoodEntrypoint();
    }
}
