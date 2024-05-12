import { TickerRemoteResponse, TickerDTO } from "./ticker-dto";
import { BookDTO, BookRemoteResponse } from "./book-dto";

export class DTOFactory {
  static buildBookDTO(source: BookRemoteResponse): BookDTO {
    const { book: name, description = '' } = source;
    return new BookDTO(name, description)
  }

  static buildTickerDTO(source: TickerRemoteResponse): TickerDTO {
    const { book, created_at: timestamp, low, high, last, volume, vwap, ask, bid } = source
    return new TickerDTO(book, -1, timestamp, low, high, last, volume, vwap, ask, bid );
  }
}
