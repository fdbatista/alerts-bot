import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(8001, {
  cors: {
    origin: 'http://localhost:8080', // Adjust this to match your frontend's origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
})
export class IndicatorsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private clients: Set<Socket> = new Set();

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.clients.add(client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client);
  }

  emit(channel: string, message: string | undefined = undefined): void {
    this.server.emit(channel, message);
  }

}
