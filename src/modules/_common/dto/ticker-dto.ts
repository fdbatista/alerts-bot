export class GetTickerResponse {
  constructor(
    readonly tickerId: number,
    readonly tradeTime: Date,
    readonly low: number,
    readonly high: number,
    readonly open: number,
    readonly close: number,
  ) { }
}


export class TickerDTO {
  public assetId: number
  public externalId: string
  public timestamp: Date
  public price: number
}

export class CandlestickDTO {
  constructor(
    readonly bucket: Date,
    readonly open: number,
    readonly close: number,
    readonly high: number,
    readonly low: number,
  ) { }
}
