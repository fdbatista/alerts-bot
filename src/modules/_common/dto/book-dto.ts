export class BookRemoteResponse {
  constructor(
    readonly book: string,
    readonly description: string,
  ) { }
}

export class BookDTO {
  constructor(
    readonly name: string,
    readonly description: string
  ) { }
}
