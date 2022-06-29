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

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server;
	private logger: Logger = new Logger('AppGateway');
  users: number = 0;
  async handleConnection() {

    // A client has connected
    this.users++;
    // Notify connected clients of current users
    this.server.emit('users', this.users);
  }
  async handleDisconnect() {
    // A client has disconnected
    this.users--;
    // Notify connected clients of current users
    this.server.emit('users', this.users);
  }
  @SubscribeMessage("send_message")
  async onChat(client, message) {
	this.logger.log("test");
    client.broadcast.emit("send_message", message);
  }

	// @WebSocketServer() server: Server; // if were to send the msg to everyone

	// private logger: Logger = new Logger('AppGateway');
	
	// afterInit(server: Server) { // will run as soo nas the gateway initializes
	// 	this.logger.log("initialized"); // upon initialization, this runs
	// }
	
	// handleConnection(client: Socket, ...args: any[]){
	// 	this.logger.log(`client connected: ${client.id}`); // upon an client connection this runs with unique client id
	// 	this.server.on("connection", (socket) => {

	// 		socket.on("send_message", (data) => {
	// 			socket.emit("receive_message", data);
	// 			this.logger.log(`message emited : ${data}`);
	// 			socket.disconnect();
	// 			// socket.to(data.room).emit("receive_message", data);
	// 		});
	// 	});
	// }

	// handleDisconnect(client: Socket){
	// 	client.disconnect();
	// 	this.logger.log(`client disconnected: ${client.id}`); // upon disconnection this runs with unique client id
	// }

	// https://socket.io/docs/v4/broadcasting-events/
	// io.emit("hello", "world"); to all connected clients

	// io.on("connection", (socket) => {
	//   socket.broadcast.emit("hello", "world");
	// }); to all connected clients except the sender

	// https://socket.io/docs/v4/listening-to-events/
	// socket.on(eventName, listener)

	// @SubscribeMessage("send_message") // if were to send this to everyone
	// send_message(client: Socket, text: string): void {
	// this.server.emit("receive_message", text);
	// // client.emit('updated_dy', text);
	// console.log(`client: `, client)
	// console.log(`text: `, text)
	// }
}

// import {
// 	WebSocketGateway,
// 	WebSocketServer,
// 	SubscribeMessage,
// 	OnGatewayConnection,
// 	OnGatewayDisconnect,
// 	OnGatewayInit
//   } from '@nestjs/websockets';
//   import { Socket, Server } from 'socket.io'


//   @WebSocketGateway({
// 	cors: {
// 	  origin: "http://localhost:3000",
// 	  methods: ["GET", "POST"],
// 	},
// })

// export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
// 	@WebSocketServer() server;
// 	users: number = 0;
// 	async handleConnection() {
// 	  // A client has connected
// 	  this.users++;
// 	  // Notify connected clients of current users
// 	  this.server.emit('users', this.users);
// 	}
// 	async handleDisconnect() {
// 	  // A client has disconnected
// 	  this.users--;
// 	  // Notify connected clients of current users
// 	  this.server.emit('users', this.users);
// 	}
// 	@SubscribeMessage('chat')
// 	async onChat(client, message) {
// 	  client.broadcast.emit('chat', message);
// 	}
// }