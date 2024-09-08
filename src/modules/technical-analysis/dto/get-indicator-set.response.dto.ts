// import { Stoch } from "src/database/entities/stoch"
// import { Rsi } from "src/database/entities/rsi"
// import { Ema } from "src/database/entities/ema"
// import { CandlestickDTO } from "src/modules/_common/dto/ticker-dto"

// export class GetIndicatorSetResponseDto {
//     public readonly tickers: CandlestickDTO[]
//     public readonly rsi: Rsi[]
//     public readonly stoch: Stoch[]
//     public readonly ema: Ema[]
// }

export class GetIndicatorSetResponseDto {
    public readonly tickers: {
        timestamp: string
        open: number
        close: number
        high: number
        low: number
    }[]

    public readonly rsi: {
        timestamp: string
        value: number
    }[]

    public readonly stoch: {
        timestamp: string
        k: number
        d: number
    }[]

    public readonly ema: {
        timestamp: string
        value: number
    }[]
}
