import { Ema } from "src/database/entities/ema";
import { ema, stoch, rsi, StochResult } from 'indicatorts';
import { Stoch } from "src/database/entities/stoch";
import { Rsi } from 'src/database/entities/rsi';
import { EMA_CONFIG, RSI_CONFIG, STOCH_CONFIG } from "../_config";

export class IndicatorFactory {
    
    static ema(assetId: number, timestamp: Date, candlestickDuration: number, closings: number[]): Ema {
        const emaResult: number[] = ema(closings, EMA_CONFIG);
        const [lastEma] = emaResult.slice(-1);

        const entity = new Ema();

        entity.assetId = assetId;
        entity.timestamp = timestamp;
        entity.minutes = candlestickDuration;
        entity.value = lastEma;

        return entity;
    }

    public static stoch(assetId: number, timestamp: Date, candlestickDuration: number, highs: number[], lows: number[], closings: number[]): Stoch {
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

    public static rsi(assetId: number, timestamp: Date, candlestickDuration: number, closings: number[]): Rsi {
        const rsiResult: number[] = rsi(closings, RSI_CONFIG);
        const [lastRsi] = rsiResult.slice(-1);

        const entity = new Rsi();

        entity.assetId = assetId;
        entity.timestamp = timestamp;
        entity.minutes = candlestickDuration;
        entity.value = lastRsi;

        return entity;
    }

}
