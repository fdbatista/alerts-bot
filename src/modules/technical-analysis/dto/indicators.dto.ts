import { CandlestickDTO } from "src/modules/_common/dto/ticker-dto"
import { MovingAverageDTO } from "./moving-average.dto"

export class IndicatorsDTO {
    public interval: number
    public candlesticks: CandlestickDTO[]
    public closings: number[]
    public rsi: number[]
    public stoch: {
        k: number[],
        d: number[],
    }
    public sma: MovingAverageDTO[]
    public ema: MovingAverageDTO[]
}
