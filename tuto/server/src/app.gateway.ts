import { Logger } from '@nestjs/common';
import { SubscribeMessage, 
	WebSocketGateway, 
	OnGatewayInit, 
	OnGatewayConnection, 
	OnGatewayDisconnect,
	WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({
	cors: {
	  origin: "http://localhost:3000",
	  methods: ["GET", "POST"],
	},
})

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server;
	private logger: Logger = new Logger('AppGateway');
	async handleConnection() {

		// A client has connected
		// Notify connected clients of current users
		//this.server.emit('users', this.users);
	}
	async handleDisconnect() {
		// A client has disconnected
		// Notify connected clients of current users
		//this.server.emit('users', this.users);
	}
	@SubscribeMessage("send_message")
	async onChat(client, message) {
		this.logger.log(`message ${message}`);
		client.broadcast.emit("send_message", message);
	}

}