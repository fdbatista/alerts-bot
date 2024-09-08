import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { OnEvent } from '@nestjs/event-emitter';
import { TechnicalAnalysisDTO } from '../technical-analysis/indicators-builder/indicators-updated-payload.dto';
import { TickerDTO } from '../_common/dto/ticker-dto';
import { BROADCAST_TECHNICAL_DATA } from '../technical-analysis/indicators-builder/config';
import { Rsi } from 'src/database/entities/rsi';
import { Stoch } from 'src/database/entities/stoch';
import { Ema } from 'src/database/entities/ema';
import { DateUtil } from 'src/utils/date.util';

@WebSocketGateway()
export class WebsocketService implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any): void {
        console.log(`Message received from client ${client.id}: ${JSON.stringify(payload)}`);
    }

    @OnEvent(BROADCAST_TECHNICAL_DATA, { async: true })
    broadcastIndicators(payload: TechnicalAnalysisDTO): void {
        const { assets, tickers, rsiData, stochData, emaData } = payload;

        for (const asset of assets) {
            const { id: assetId } = asset

            const [lastTicker] = tickers.filter((ticker: TickerDTO) => ticker.assetId === assetId).slice(-1)
            const timestamp = DateUtil.formatDate(lastTicker.timestamp)

            const ticker = { timestamp, open: lastTicker.open, close: lastTicker.close, low: lastTicker.low, high: lastTicker.high }

            const [lastRsi] = rsiData.filter((rsi: Rsi) => rsi.assetId === assetId).slice(-1)
            const rsi = { timestamp, value: lastRsi.value }

            const [lastStoch] = stochData.filter((stoch: Stoch) => stoch.assetId === assetId).slice(-1)
            const stoch = { timestamp, k: lastStoch.k, d: lastStoch.d }

            const [lastEma] = emaData.filter((ema: Ema) => ema.assetId === assetId).slice(-1)
            const ema = { timestamp, value: lastEma.value }

            const eventName = `${BROADCAST_TECHNICAL_DATA}[${assetId}]`
            const payload = { ticker, rsi, stoch, ema }

            this.server.emit(eventName, payload);
        }
    }

}
