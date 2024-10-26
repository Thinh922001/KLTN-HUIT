import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() productId: number, @ConnectedSocket() client: Socket): void {
    client.join(`product_${productId}`);
    console.log(`Client ${client.id} joined room: product_${productId}`);
  }

  sendCommentToRoom(productId: number, comment: any) {
    this.server.to(`product_${productId}`).emit('newComment', comment);
  }

  sendUpdateToProductRoom(productId: number, updateData: any) {
    this.server.to(`product_${productId}`).emit('updateComment', updateData);
    console.log(`Sent update to product room product_${productId}:`, updateData);
  }
}
