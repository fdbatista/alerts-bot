import { Ema } from "src/database/entities/ema";
import { ema } from 'indicatorts';

const EMA_CONFIG = { period: 45 };

export class EmaFactory {
    
    static build(assetId: number, timestamp: Date, candlestickDuration: number, closings: number[]): Ema {
        const emaResult: number[] = ema(closings, EMA_CONFIG);
        const [lastEma] = emaResult.slice(-1);

        const entity = new Ema();

        entity.assetId = assetId;
        entity.timestamp = timestamp;
        entity.minutes = candlestickDuration;
        entity.value = lastEma;

        return entity;
    }

}
