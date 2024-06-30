export class TickerRemoteResponse {
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
  constructor(
    public assetId: number,
    readonly externalId: string,
    readonly timestamp: Date,
    readonly low: number,
    readonly high: number,
    readonly open: number,
    readonly close: number,
  ) { }
}
