import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { GameDetails } from './types';

let details: GameDetails = new GameDetails;

const sleep = (milliseconds: number) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

const random_ball = () => {
	return Math.random() * Math.PI / 2 - Math.PI / 4 + getRandomInt(2) * Math.PI;
}

class Player {

	y_pos: number;
	delta: number;
	id: string;
	score: number;
	socket: Socket;

	constructor(id: string, socket: Socket) {
		this.y_pos = 0;
		this.delta = 0;
		this.id = id;
		this.score = 0;
		this.socket = socket;
	}
}

class Pong {
	private logger: Logger = new Logger('GameGateway');
	is_running: boolean;
	first_player: Player = null;
	second_player: Player = null;
	ball_x: number = 350;
	ball_y: number = 250;
	ball_angle: number = random_ball();
	players_waiting: any = [];
	spectator: any = [];
	winning_score: number = 10;
	ball_speed: number = 10;

	constructor(private gameService: GameService) {}

	game_state() {
		this.logger.log(`Player1: ${this.first_player.id}`);
		this.logger.log(`Player2: ${this.second_player.id}`);
	}

	change_position(player: Player) {
		player.y_pos += player.delta * 10;
		if (player.y_pos < 10) {
			player.y_pos = 10;
		} else if (player.y_pos > 430) {
			player.y_pos = 430;
		}
	}

	touch_player(player: Player): boolean {
		const x: number = player == this.first_player ? 5 : 670;

		return (this.ball_x >= x && this.ball_x <= x + 20) && (this.ball_y >= player.y_pos && this.ball_y <= player.y_pos + 70);
	}

	change_ball_pos(player_1: Player, player_2: Player) {
		this.ball_x += this.ball_speed * Math.cos(this.ball_angle); //
		this.ball_y += this.ball_speed * Math.sin(this.ball_angle); //
		if (this.ball_x > 700) {
			player_1.score += 1;
			this.ball_x = 350;
			this.ball_y = 250;
			this.ball_angle = random_ball();
		} else if (this.ball_x < 0) {
			player_2.score += 1;
			this.ball_x = 350;
			this.ball_y = 250;
			this.ball_angle = random_ball();
		}
		if (this.ball_y >= 495) {
			this.ball_angle = -this.ball_angle;
		} else if (this.ball_y <= 5) {
			this.ball_angle = -this.ball_angle;
		}
		if (this.touch_player(this.first_player)) {
			this.ball_angle = Math.PI - this.ball_angle;
		}
		if (this.touch_player(this.second_player)) {
			this.ball_angle = Math.PI - this.ball_angle;
		}
	}

	async run_game() {
		this.ball_angle = random_ball();
		while (this.is_running) {
			this.change_ball_pos(this.first_player, this.second_player);
			this.change_position(this.first_player);
			this.change_position(this.second_player);
			this.first_player.socket.emit("getPosition", `${this.first_player.y_pos} ${this.second_player.y_pos} ${this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score}`);
			this.second_player.socket.emit("getPosition", `${this.second_player.y_pos} ${this.first_player.y_pos} ${700 - this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score} `);
			for (let index = 0; index < this.spectator.length; index++) {
				this.spectator[index].socket.emit("getPosition", `${this.first_player.y_pos} ${this.second_player.y_pos} ${this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score}`);
			}
			if (this.first_player.score >= this.winning_score || this.second_player.score >= this.winning_score)
			{
				this.is_running = false;
				this.first_player.socket.emit("getPosition", `${this.first_player.y_pos} ${this.second_player.y_pos} ${this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score}`);
				this.second_player.socket.emit("getPosition", `${this.second_player.y_pos} ${this.first_player.y_pos} ${700 - this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score} `);
				this.database_create(this.first_player.id);
				this.database_create(this.second_player.id);
			}
			await sleep(50);
		}
	}

	remove_player(id: string) {
		if (this.first_player && this.first_player.id == id) {
			this.first_player = null;
			this.is_running = false;
		} else if (this.second_player && this.second_player.id == id) {
			this.second_player = null;
			this.is_running = false;
		} else {
			for (let index = 0; index < this.spectator.length; index++) {
				const element: Player = this.spectator[index];
				if (element.id == id) {
					this.spectator.splice(index, 1);
					break;
				}
			}
		}
		if (this.first_player == null) {
			this.first_player = this.second_player;
			this.second_player = null;
		}
		this.logger.log(this.spectator.length)
	}

	add_player(p: Player) {
		if (this.first_player == null) {
			this.first_player = p;
		} else if (this.second_player == null) {
			this.first_player.socket.emit("players", "First player");
			this.second_player = p;
			this.is_running = true;
			this.ball_x = 350;
			this.ball_y = 250;
			this.run_game()
		} else {
			this.spectator.push(p);
		}
	}

	set_details(id: string)
	{
		if (this.first_player && this.first_player.id == id)
		{
			details.login = this.first_player.id;
			details.opponent_login = this.second_player.id;
			details.score = this.first_player.score;
			details.opponent_score = this.second_player.score;
			if (this.first_player.score >= this.winning_score)
			details.has_won = true;
			else if (this.second_player.score >= this.winning_score)
			details.has_won = false;
		}
		
		else if (this.second_player && this.second_player.id == id)
		{
			details.login = this.second_player.id;
			details.opponent_login = this.first_player.id;
			details.score = this.second_player.score;
			details.opponent_score = this.first_player.score;
			if (this.second_player.score >= this.winning_score)
			details.has_won = true;
			else if (this.first_player.score >= this.winning_score)
			details.has_won = false;
		}
		
		this.logger.log(`details.login ${details.login}`);
		this.logger.log(`details.opponent_login ${details.opponent_login}`);
		this.logger.log(`details.score ${details.score}`);
		this.logger.log(`details.opponent_score ${details.opponent_score}`);
		this.logger.log(`details.has_won ${details.has_won}`);
		this.logger.log(`--------------------------------`);
	}

	async database_create(id: string): Promise<void> {
		this.set_details(id);
		await this.gameService.createUser(details);
	}

	set_delta(delta: number, id: string) {
		if (this.first_player && this.first_player.id == id) {
			this.first_player.delta = delta;
		} else if (this.second_player && this.second_player.id == id) {
			this.second_player.delta = delta;
		}
	}
}

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(private gameService: GameService) {}
	@WebSocketServer() wss: Server;

	game: Pong = new Pong(this.gameService);

	afterInit() {}

	handleConnection(client: Socket, ...args: any[]) {
		client.emit("winning_score", this.game.winning_score.toString());

		if (this.game.first_player == null) {
			client.emit("players", "First player");
		}
		else if (this.game.first_player && this.game.second_player == null) {
			client.emit("players", "Second player");
		}
		else
			client.emit("players", "Watching");
		this.game.add_player(new Player(client.id, client));
	}

	handleDisconnect(client: Socket){
		this.game.remove_player(client.id);
	}

	private logger: Logger = new Logger('GameGateway');

	@SubscribeMessage('setPosition')
	handleMessage(client: Socket, message: string): void {
		if (message == 'd') {
			this.game.set_delta(1, client.id);
		} else if (message == 'u') {
			this.game.set_delta(-1, client.id);
		} else if (message == 'o') {
			this.game.set_delta(0, client.id);
		}
	}

	// @SubscribeMessage('set_speed')
	// handleSpeed(client: Socket, message: any): void {
	// 	const obj = message;
	// 	this.game.ball_speed = obj.ball_speed;
	// }

	@SubscribeMessage('play_again')
	handleReplay(client: Socket, message: string) : void {
		if (!JSON.stringify(message).includes("Watching") && !this.game.is_running) // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
		{
			this.game.is_running = true;
			this.game.first_player.score = 0;
			this.game.second_player.score = 0;
			this.game.run_game();
		}
	}
}
