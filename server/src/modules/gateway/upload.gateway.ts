import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway({
  path: '/socket',
  allowEIO3: true,
  cors: {
    origin: /.*/,
    credentials: true,
  },
})
export class UploadGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}
  @WebSocketServer() private ws: Server

  afterInit() {}
  async handleConnection() {}
  async handleDisconnect() {}
  @SubscribeMessage('uploadProgress')
  async sendUploadProgress(data: number) {
    this.ws.emit('uploadProgress', data)
  }
}
