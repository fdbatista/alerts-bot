import { BookDTO } from "../_common/dto/book-dto"
import { TickerDTO } from "../_common/dto/ticker-dto"

export interface IExchangeConnector {
    getTicker(symbol: string): Promise<TickerDTO>
    getBooks(): Promise<BookDTO[]>
}
