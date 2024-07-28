
import { Ema } from 'src/database/entities/ema';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';

export class IndicatorFactory {

    public static createRsiEntity(assetId: number, timestamp: Date, minutes: number, value: number) {
        const result = new Rsi();

        result.assetId = assetId;
        result.timestamp = timestamp;
        result.minutes = minutes;
        result.value = value;

        return result;
    }

    public static createStochEntity(assetId: number, timestamp: Date, minutes: number, k: number, d: number) {
        const result = new Stoch();

        result.assetId = assetId;
        result.timestamp = timestamp;
        result.minutes = minutes;
        result.k = k;
        result.d = d;

        return result;
    }

    static createEmaEntity(assetId: number, timestamp: Date, minutes: number, value: number) {
        const result = new Ema();

        result.assetId = assetId;
        result.timestamp = timestamp;
        result.minutes = minutes;
        result.value = value;

        return result;
    }

}
