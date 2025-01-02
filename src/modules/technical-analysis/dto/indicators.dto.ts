import { CandlestickDTO } from "src/modules/_common/dto/ticker-dto"

export class IntervalDataDTO {
    public interval: number
    public candlesticks: CandlestickDTO[]
    public closings: number[]
}
