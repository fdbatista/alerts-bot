import { TickerDTO } from "../../_common/dto/ticker-dto"

export interface IExchangeConnector {
    getTickers(): Promise<TickerDTO[]>
}
