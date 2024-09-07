import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { OnEvent } from '@nestjs/event-emitter';
import { TechnicalAnalysisDTO } from '../technical-analysis/indicators-builder/indicators-updated-payload.dto';
import { TickerDTO } from '../_common/dto/ticker-dto';
import { BROADCAST_TECHNICAL_DATA } from '../technical-analysis/indicators-builder/config';

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
        console.log(`Emitting message`);

        const { assets, tickers: tickerDTOs, rsiData, stochData, emaData } = payload;

        const tickers = tickerDTOs.map((ticker: TickerDTO) => {
            const { assetId, timestamp, low, high, open, close: value } = ticker;
            return { assetId, timestamp, low, high, open, value };
        });

        this.server.emit('message', { tickers, assets, rsiData, stochData, emaData });
    }

}
