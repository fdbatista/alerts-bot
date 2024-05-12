export class TickerRemoteResponse {
  constructor(
    readonly book: string,
    readonly created_at: Date,
    readonly low: number,
    readonly high: number,
    readonly last: number,
    readonly volume: number,
    readonly vwap: number,
    readonly ask: number,
    readonly bid: number,
  ) { }
}

export class TickerDTO {
  constructor(
    readonly book: string,
    readonly bookId: number,
    readonly timestamp: Date,
    readonly low: number,
    readonly high: number,
    readonly last: number,
    readonly volume: number,
    readonly vwap: number,
    readonly ask: number,
    readonly bid: number,
  ) { }
}
