import { Logger } from '@nestjs/common';
import { SubscribeMessage, 
	WebSocketGateway, 
	OnGatewayInit, 
	OnGatewayConnection, 
	OnGatewayDisconnect,
	WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'
// npm i --save @nestjs/websockets @nestjs/platform-socket.io

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server; // if were to send the msg to everyone

	private logger: Logger = new Logger('AppGateway');
	
	afterInit(server: Server) { // will run as soo nas the gateway initializes
		this.logger.log("initialized"); // upon initialization, this runs
	}

	handleConnection(client: Socket, ...args: any[]){
		this.logger.log(`client connected: ${client.id}`); // upon an client connection this runs with unique client id
	}

	handleDisconnect(client: Socket){
		this.logger.log(`client disconnected: ${client.id}`); // upon disconnection this runs with unique client id
	}

//   @SubscribeMessage('msgToServer') // when want handle event, put decorator above + name event going to handle
//   handleMessage(client: Socket, text: string): WsResponse<string> { // arguemtns : client socket, text : string
//     return { event: 'msgToClient', data: 'Hello World'}; // only the client that sent the msg gets the reply
//   }

	// @SubscribeMessage('msgToServer')
	// handleMessage(client: Socket, text: string): void { 
	// 	client.emit('msgToClient', text); // take text sent by client and emit an event pass text back
	// }

	@SubscribeMessage('msgToServer') // if were to send this to everyone
	handleMessage(client: Socket, text: string): void {
	this.wss.emit('msgToClient', text);
	console.log(`client: `, client)
	console.log(`text: `, text)
	}
}
