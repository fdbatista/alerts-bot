import { AssetDTO } from "src/modules/ticker/dto/asset.dto";
import { PotentialEntrypoint } from "./potential-entrypoint.dto";

export interface TechnicalAnalysisResult {
    asset: AssetDTO;
    interval: number;
    potentialEntrypoints: PotentialEntrypoint[];
}
