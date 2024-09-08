import { Stoch } from "src/database/entities/stoch"
import { Rsi } from "src/database/entities/rsi"
import { Ema } from "src/database/entities/ema"
import { CandlestickDTO } from "src/modules/_common/dto/ticker-dto"

export class GetIndicatorSetResponseDto {
    public readonly tickers: CandlestickDTO[]
    public readonly rsi: Rsi[]
    public readonly stoch: Stoch[]
    public readonly ema: Ema[]
}
