import { Controller, Get, Query, Version } from '@nestjs/common';
import { GetRsiDto } from './dto/rsi.dto';
import { IndicatorsService } from './indicators.service';
import { Rsi } from 'src/database/entities/rsi';

@Controller('indicators')
export class IndicatorsController {

    constructor(private readonly indicatorsService: IndicatorsService) { }

    @Version('1')
    @Get('rsi')
    async getRsi(@Query() dto: GetRsiDto): Promise<Rsi[]> {
        return await this.indicatorsService.getRsi(dto);
    }

}
