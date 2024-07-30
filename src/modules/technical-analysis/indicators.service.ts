import { Injectable } from '@nestjs/common';

import { RsiRepository } from './listeners/repository/rsi.repository';
import { StochRepository } from './listeners/repository/stoch.repository';
import { EmaRepository } from './listeners/repository/ema.repository';
import { GetRsiDto } from './dto/rsi.dto';
import { Rsi } from 'src/database/entities/rsi';


@Injectable()
export class IndicatorsService {

    constructor(
        private readonly rsiRepository: RsiRepository,
        private readonly stochRepository: StochRepository,
        private readonly emaRepository: EmaRepository,
    ) { }

    async getRsi(dto: GetRsiDto): Promise<Rsi[]> {
        const { assetId, minutes } = dto;
        return await this.rsiRepository.getValues(assetId, minutes, 30);
    }

}
