import { Controller, Get, Query, UseGuards, Version } from '@nestjs/common';
import { GetIndicatorRequestDto } from './dto/get-indicator.request.dto';
import { IndicatorsService } from './indicators.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetIndicatorResponseDto } from './dto/get-indicator.response.dto';
import { GetIndicatorSetResponseDto } from './dto/get-indicator-set.response.dto';

@Controller('indicators')
export class IndicatorsController {

    constructor(private readonly indicatorsService: IndicatorsService) { }

    @UseGuards(JwtAuthGuard)
    @Version('1')
    @Get()
    async getIndicators(@Query() dto: GetIndicatorRequestDto): Promise<GetIndicatorSetResponseDto> {
        const { assetId, minutes, take } = dto;
        return await this.indicatorsService.getTechnicalIndicators(assetId, minutes, take);
    }

    @UseGuards(JwtAuthGuard)
    @Version('1')
    @Get('rsi')
    async getRsi(@Query() dto: GetIndicatorRequestDto): Promise<GetIndicatorResponseDto[]> {
        const { assetId, minutes, take } = dto;
        return await this.indicatorsService.getRsi(assetId, minutes, take);
    }

}
