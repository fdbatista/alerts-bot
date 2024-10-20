import { Ema } from "src/database/entities/ema";
import { Rsi } from "src/database/entities/rsi";
import { Stoch } from "src/database/entities/stoch";
import { TickerDTO } from "src/modules/_common/dto/ticker-dto";
import { AssetDTO } from "src/modules/ticker/dto/asset.dto";

export class TechnicalAnalysisDTO {
    constructor(
        public readonly assets: AssetDTO[],
        public readonly tickers: TickerDTO[],
        public readonly rsiData: Rsi[],
        public readonly stochData: Stoch[],
        public readonly emaData: Ema[],
    ) { }
}
