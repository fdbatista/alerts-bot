import _ from "lodash";
import { GenericDTO } from "./generic-dto";

export interface ITicker {
  readonly book: string
  readonly timestamp: Date
  readonly low: number
  readonly high: number
  readonly last: number
  readonly volume: number
  readonly vwap: number
  readonly ask: number
  readonly bid: number
}

export class TickerDTO extends GenericDTO<ITicker> {}
