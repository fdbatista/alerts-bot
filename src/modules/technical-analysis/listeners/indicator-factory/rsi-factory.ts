import { Rsi } from 'src/database/entities/rsi';
import { rsi } from 'indicatorts';

const RSI_CONFIG = { period: 14 };

export class RsiFactory {

    public static build(assetId: number, timestamp: Date, candlestickDuration: number, closings: number[]): Rsi {
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
