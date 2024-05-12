import _ from "lodash";
import { GenericDTO } from "./generic-dto";
import { ITicker, TickerDTO } from "./ticker-dto";
import { BookDTO, IBook } from "./book-dto";

export class DTOFactory {
  static buildBookDTO(source: IBook): BookDTO {
    const builder = this.getDTOBuilder(BookDTO);
    return builder(source);
  }

  static buildTickerDTO(source: ITicker): TickerDTO {
    const builder = this.getDTOBuilder(TickerDTO);

    return builder(source);
  }

  private static getDTOBuilder<T>(dtoClass: new (data: T) => GenericDTO<T>) {
    return (data: T): GenericDTO<T> => {
      return new dtoClass(data);
    };
  }
}
