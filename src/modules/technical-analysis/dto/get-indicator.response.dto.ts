export class GetIndicatorResponseDto {

    constructor(
        public readonly timestamp: Date,
        public readonly value: number
    ) { }

}
