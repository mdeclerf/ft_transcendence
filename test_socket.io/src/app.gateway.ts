import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Socket, Server } from 'socket.io';
  import { AppService } from './app.service';
  import { Chat } from './chat.entity';

//https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
	@WebSocketGateway({
	cors: {
	  origin: '*',
	},
  })

  export class AppGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
	constructor(private appService: AppService) {}

	@WebSocketServer() server: Server;
  
	// https://javascript.info/async-await
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
	// https://developer.mozilla.org/en-US/docs/Glossary/Asynchronous
	// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing
	@SubscribeMessage('sendMessage')
	async handleSendMessage(client: Socket, payload: Chat): Promise<void> {
	  await this.appService.createMessage(payload);
	  this.server.emit('recMessage', payload);
	}

	afterInit(server: Server) {
	  console.log(server);
	}

	handleDisconnect(client: Socket) {
	  console.log(`Disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
	  console.log(`Connected ${client.id}`);
	}
}
