import { Asset } from "src/database/entities/asset";
import { Ema } from "src/database/entities/ema";
import { Rsi } from "src/database/entities/rsi";
import { Stoch } from "src/database/entities/stoch";

export class IndicatorsUpdatedPayloadDTO {
    constructor(
        public readonly assets: Asset[],
        public readonly rsiData: Rsi[],
        public readonly stochData: Stoch[],
        public readonly emaData: Ema[],
    ) { }
}
