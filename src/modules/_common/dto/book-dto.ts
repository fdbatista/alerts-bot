import { GenericDTO } from "./generic-dto";

export interface IBook {
  readonly name: string
  readonly description: string
}

export class BookDTO extends GenericDTO<IBook> {}
