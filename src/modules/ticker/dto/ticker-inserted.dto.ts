import { Asset } from "src/database/entities/asset";
import { TickerDTO } from "../../_common/dto/ticker-dto";

export class TickerInsertedDTO {

    constructor(
        public readonly assets: Asset[],
        public readonly tickers: TickerDTO[]
    ) { }

}
