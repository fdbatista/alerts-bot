import { GetTickerResponse, TickerDTO } from "./ticker-dto";
import { BookDTO, BookRemoteResponse } from "./book-dto";

export class DTOFactory {
  static buildBookDTO(source: BookRemoteResponse): BookDTO {
    const { book: name, description = '' } = source;
    return new BookDTO(name, description)
  }

  static buildTickerDTO(source: GetTickerResponse): TickerDTO {
    const { tickerId: externalId, tradeTime: timestamp, low, high, open, close } = source
    return new TickerDTO(-1, `${externalId}`, timestamp, low, high, open, close);
  }
}
