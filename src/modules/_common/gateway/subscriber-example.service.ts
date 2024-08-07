import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { INDICATORS_UPDATED_MESSAGE } from 'src/modules/technical-analysis/listeners/config';
import { EnvService } from '../env/env.service';
import { LoggerUtil } from 'src/utils/logger.util';

@Injectable()
export class GatewayService {

    private socket: Socket;

    constructor(
        envService: EnvService
    ) {
        const websocketAddress = envService.getValue('WEBSOCKET_ADDRESS');
        this.socket = require('socket.io-client')(websocketAddress);
        this.setupSocketEvents();
    }

    private setupSocketEvents() {
        this.socket.on(INDICATORS_UPDATED_MESSAGE, (data) => {
            LoggerUtil.log(`Received event`, data);
        });
    }

    emitClientEvent(payload: any) {
        this.socket.emit(INDICATORS_UPDATED_MESSAGE, { payload });
    }

}
