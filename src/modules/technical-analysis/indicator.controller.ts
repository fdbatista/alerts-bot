import { Controller, Get, Query, Version } from '@nestjs/common';
import { GetIndicatorRequestDto, GetIndicatorResponseDto } from './dto/indicator.dto';
import { IndicatorsService } from './indicators.service';

@Controller('indicators')
export class IndicatorsController {

    constructor(private readonly indicatorsService: IndicatorsService) { }

    @Version('1')
    @Get('rsi')
    async getRsi(@Query() dto: GetIndicatorRequestDto): Promise<GetIndicatorResponseDto[]> {
        const { assetId, minutes } = dto;
        return await this.indicatorsService.getRsi(assetId, minutes);
    }

}
