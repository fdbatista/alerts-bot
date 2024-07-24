import { Controller, Get, Param, Version } from '@nestjs/common';
import { EntrypointDetectorService } from './entrypoint-detector.service';

@Controller('technical-analysis')
export class TechnicalAnalysisController {
    constructor(
        private readonly entrypointDetectorService: EntrypointDetectorService,
    ) { }

    @Version('1')
    @Get('detection/entrypoint/:assetTypeId')
    async getPotentialEntrypoint(@Param('assetTypeId') assetTypeId: number): Promise<object> {
        return await this.entrypointDetectorService.detectPotentialEntrypoints([assetTypeId]);
    }
}
