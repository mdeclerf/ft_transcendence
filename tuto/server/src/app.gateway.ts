import { Logger } from '@nestjs/common';
import { SubscribeMessage, 
	WebSocketGateway, 
	OnGatewayInit, 
	OnGatewayConnection, 
	OnGatewayDisconnect,
	WebSocketServer } from '@nestjs/websockets';

let player_delta : number = 0;
let player_y : number = 400;


export const update_y = async (server: any) : Promise<void> => {
	const logger: Logger = new Logger('AppGatewaydd');
	while (10) {
		logger.log(`message dhjsf`);
		await new Promise(r => setTimeout(r, 200));
	}
}

// let hf: boolean = true;

@WebSocketGateway({
	cors: {
	  origin: "http://localhost:3000",
	  methods: ["GET", "POST"],
	},
})



export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {

	async update_y (client: any) {
		// if (!hf)
		// 	return ;
		// hf = false;
		let i:number = 0
		while (++i < 10000) {

			
			player_y += player_delta * 5;
			if (player_y < 0)
				player_y = 0;
			else if (player_y > 600)
				player_y = 600;
			client.emit("receive_message", player_y.toString());
			await new Promise(r => setTimeout(r, 50));
		}
		// hf = true; // wtf ? 
	}

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

	@SubscribeMessage("init")
	async onInit(client, message) {
		this.update_y(client);
	}

	@SubscribeMessage("send_message")
	async onChat(client, message) {
		if (message == "move_up")
		{
			player_delta = -1;
		}
		else if (message === "move_down")
		{
			player_delta = 1
		}
		else if (message === "stop")
		{
			player_delta = 0;
		}



		// this.logger.log(`message ${message}`);
		// client.broadcast.emit("send_message", message);
	}

}