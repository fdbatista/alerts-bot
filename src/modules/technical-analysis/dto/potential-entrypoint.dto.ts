import { AssetDTO } from "src/modules/ticker/dto/asset.dto";

export interface PotentialEntrypoint {
    asset: AssetDTO;
    byBreak: boolean;
    byRsi: boolean;
    byStoch: boolean;
}
