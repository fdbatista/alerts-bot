import { Controller, Get, Param, Version } from '@nestjs/common';

@Controller('technical-analysis')
export class TechnicalAnalysisController {
    constructor(
        
    ) { }

    @Version('1')
    @Get('detection/entrypoint/:assetTypeId')
    async getPotentialEntrypoint(@Param('assetTypeId') assetTypeId: number): Promise<object> {
        return {};
    }
}
