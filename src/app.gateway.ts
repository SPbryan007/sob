import {
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  plantilla : any = {};
  users: any = {};
  @WebSocketServer()
  wss;

  handleConnection(client: any, ...args: any[]) {
    console.log('conneted..............................');
    client.emit('connection', 'Successfully connected');
  }
  @SubscribeMessage('join')
  handleJoin(client: any, payload: any): void {
    this.users[`${payload.user}`] = client.id;
    console.log('usuario conectados', this.users);
  }

  handleDisconnect(client: any, ...args: any[]) {
    let key = this.getKeyByValue(this.users, client.id);
    console.log('user disconnected', key);
    delete this.users[key];
  }

  @SubscribeMessage('on_selected')
  handleMessage(client: any, payload: any): void {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaa', payload);

    console.log('ssssssssssssssssssssss', client);

    client.broadcast.emit('seat_selected', JSON.stringify(payload));
  }

  @SubscribeMessage('make_payment')
  handleMakePayment(client: any, payload: any): void {
    this.wss.join(client.id);
  }

  private getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
}
