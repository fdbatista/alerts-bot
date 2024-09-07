import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { OnEvent } from '@nestjs/event-emitter';
import { INDICATORS_UPDATED_MESSAGE, TICKERS_INSERTED_MESSAGE } from '../technical-analysis/indicators-builder/config';
import { Asset } from 'src/database/entities/asset';
import { IndicatorsUpdatedPayloadDTO } from '../technical-analysis/indicators-builder/indicators-updated-payload.dto';
import { TickerInsertedDTO } from '../ticker/ticker-inserted.dto';

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
    handleMessage(client: Socket, payload: { sender: string; message: string }): void {
        console.log(`Message received: ${payload.message} from ${payload.sender}`);
    }

    @OnEvent(INDICATORS_UPDATED_MESSAGE, { async: true })
    broadcastIndicators(payload: IndicatorsUpdatedPayloadDTO): void {
        console.log(`Emitting message`);
        this.server.emit('message', { type: 'indicator', payload });
    }

    @OnEvent(TICKERS_INSERTED_MESSAGE, { async: true })
    broadcastTickers(payload: TickerInsertedDTO): void {
        console.log(`Emitting message`);
        this.server.emit('message', { type: 'ticker', payload });
    }

}
