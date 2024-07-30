import { Injectable } from '@nestjs/common';

import { RsiRepository } from './listeners/repository/rsi.repository';
import { StochRepository } from './listeners/repository/stoch.repository';
import { EmaRepository } from './listeners/repository/ema.repository';
import { Rsi } from 'src/database/entities/rsi';
import { GetIndicatorResponseDto } from './dto/indicator.dto';

@Injectable()
export class IndicatorsService {

    constructor(
        private readonly rsiRepository: RsiRepository,
        private readonly stochRepository: StochRepository,
        private readonly emaRepository: EmaRepository,
    ) { }

    async getRsi(assetId: number, minutes: number): Promise<GetIndicatorResponseDto[]> {
        const values = await this.rsiRepository.getValues(assetId, minutes, 30);
        return values.map(({ timestamp, value }) => new GetIndicatorResponseDto(timestamp, value));
    }

}
