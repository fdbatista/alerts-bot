import { Controller, Get, Query, UseGuards, Version } from '@nestjs/common';
import { GetIndicatorRequestDto, GetIndicatorResponseDto } from './dto/indicator.dto';
import { IndicatorsService } from './indicators.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('indicators')
export class IndicatorsController {

    constructor(private readonly indicatorsService: IndicatorsService) { }

    @UseGuards(JwtAuthGuard)
    @Version('1')
    @Get('rsi')
    async getRsi(@Query() dto: GetIndicatorRequestDto): Promise<GetIndicatorResponseDto[]> {
        const { assetId, minutes } = dto;
        return await this.indicatorsService.getRsi(assetId, minutes);
    }

}
