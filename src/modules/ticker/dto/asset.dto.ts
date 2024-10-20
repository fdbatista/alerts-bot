export class AssetDTO {

    constructor(
        public readonly id: number,
        public readonly externalId: string,
        public readonly symbol: string,
        public readonly typeId: number,
        public readonly typeName: string,
    ) { }

}
