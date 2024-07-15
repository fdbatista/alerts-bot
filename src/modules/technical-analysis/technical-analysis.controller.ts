import { Controller, Get, Param, Version } from '@nestjs/common';
import { EntrypointDetectorService } from './entrypoint-detector.service';

@Controller('technical-analysis')
export class TechnicalAnalysisController {
    constructor(
        private readonly entrypointDetectorService: EntrypointDetectorService,
    ) { }

    @Version('1')
    @Get('detection/entrypoint/:assetId')
    async getPotentialEntrypoint(@Param('assetId') assetId: number): Promise<object> {
        return await this.entrypointDetectorService.isPotentialGoodEntrypoint(assetId);
    }
}
