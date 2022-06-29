import { Logger } from '@nestjs/common';
import { SubscribeMessage, 
	WebSocketGateway, 
	OnGatewayInit, 
	OnGatewayConnection, 
	OnGatewayDisconnect,
	WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'
// npm i --save @nestjs/websockets @nestjs/platform-socket.io

@WebSocketGateway({
	cors: {
	  origin: "http://localhost:3000",
	  methods: ["GET", "POST"],
	},
})

export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server; // if were to send the msg to everyone

	private logger: Logger = new Logger('AppGateway');
	
	afterInit(server: Server) { // will run as soo nas the gateway initializes
		this.logger.log("initialized"); // upon initialization, this runs
	}
	
	handleConnection(client: Socket, ...args: any[]){
		this.logger.log(`client connected: ${client.id}`); // upon an client connection this runs with unique client id
		this.server.on("connection", (socket) => {

			socket.on("send_message", (data) => {
				socket.emit("receive_message", data);
				this.logger.log(`message emited : ${data}`);

				// socket.to(data.room).emit("receive_message", data);
			});
		});
	}

	handleDisconnect(client: Socket){
		this.logger.log(`client disconnected: ${client.id}`); // upon disconnection this runs with unique client id
	}

	// https://socket.io/docs/v4/broadcasting-events/
	// io.emit("hello", "world"); to all connected clients

	// io.on("connection", (socket) => {
	//   socket.broadcast.emit("hello", "world");
	// }); to all connected clients except the sender

	// https://socket.io/docs/v4/listening-to-events/
	// socket.on(eventName, listener)


	// @SubscribeMessage('update_dy') // if were to send this to everyone
	// update_y(client: Socket, text: string): void {
	// this.server.emit('new_dy', text);
	// // client.emit('updated_dy', text);
	// console.log(`client: `, client)
	// console.log(`text: `, text)
	// }

}
