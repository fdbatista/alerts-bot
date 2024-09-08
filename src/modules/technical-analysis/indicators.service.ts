import { Injectable } from '@nestjs/common';

import { RsiRepository } from './indicators-builder/repository/rsi.repository';
import { StochRepository } from './indicators-builder/repository/stoch.repository';
import { EmaRepository } from './indicators-builder/repository/ema.repository';
import { TickerService } from '../ticker/ticker.service';
import { GetIndicatorResponseDto } from './dto/get-indicator.response.dto';
import { GetIndicatorSetResponseDto } from './dto/get-indicator-set.response.dto';

@Injectable()
export class IndicatorsService {

    constructor(
        private readonly tickerService: TickerService,
        private readonly rsiRepository: RsiRepository,
        private readonly stochRepository: StochRepository,
        private readonly emaRepository: EmaRepository,
    ) { }

    async getRsi(assetId: number, minutes: number, take: number): Promise<GetIndicatorResponseDto[]> {
        const values = await this.rsiRepository.getValues(assetId, minutes, take);
        return values.map(({ timestamp, value }) => new GetIndicatorResponseDto(timestamp, value));
    }

    async getTechnicalIndicators(assetId: number, minutes: number, take: number): Promise<GetIndicatorSetResponseDto> {
        const tickers = await this.tickerService.getCandlesticks(assetId, minutes, take);
        const rsi = await this.rsiRepository.getLatestValues(assetId, minutes, take);
        const ema = await this.emaRepository.getLatestValues(assetId, minutes, take);
        const stoch = await this.stochRepository.getLatestValues(assetId, minutes, take);

        return {
            tickers,
            rsi,
            ema,
            stoch
        };
    }
}
