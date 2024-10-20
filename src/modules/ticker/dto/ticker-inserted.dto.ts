import { AssetDTO } from "./asset.dto";
import { Ticker } from "src/database/entities/ticker";

export class TickerInsertedDTO {

    constructor(
        public readonly assets: AssetDTO[],
        public readonly tickers: Ticker[]
    ) { }

}
