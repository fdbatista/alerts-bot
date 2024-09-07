import { Stoch } from 'src/database/entities/stoch';
import { StochResult, stoch } from 'indicatorts';

const STOCH_CONFIG = { kPeriod: 14, dPeriod: 3 };

export class StochFactory {

    public static build(assetId: number, timestamp: Date, candlestickDuration: number, highs: number[], lows: number[], closings: number[]): Stoch {
        const stochResult: StochResult = stoch(highs, lows, closings, STOCH_CONFIG);
        const { k, d } = stochResult;

        const [lastK] = k.slice(-1);
        const [lastD] = d.slice(-1);

        const entity = new Stoch();

        entity.assetId = assetId;
        entity.timestamp = timestamp;
        entity.minutes = candlestickDuration;
        entity.k = lastK;
        entity.d = lastD;

        return entity;
    }

}
