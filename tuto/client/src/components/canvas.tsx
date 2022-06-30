import React, { useEffect, useRef, useState} from 'react';
import './styles.css';
import { io } from "socket.io-client";

const ws = io("http://localhost:3001");
const up_key: string = "ArrowUp";
const down_key: string = "ArrowDown";
let last_send: string = "ArrowDown";
let player_status: string;

const draw_players = (context:any, player1_y: number, player2_y: number, ball_x: number, ball_y: number) => {
	context.clearRect(-100, -100, context.canvas.width + 100, context.canvas.height + 100);
	context.fillStyle = 'blue';
	context.fillRect(ball_x -5, ball_y - 5, 10, 10);
	context.fill();
	context.fillStyle = 'red';
	context.fillRect(10, player1_y, 10, 60);
	context.fillRect(context.canvas.width - 20, player2_y, 10, 60);
}

const draw_board = (player1_score: number, player2_score:number) : string => {
	if (player_status === 'first player')
		return `${player1_score} vs ${player2_score }`
	else if (player_status === 'second player')
		return `${player2_score} vs ${player1_score}`
	else
		return `player 1: ${player1_score} vs player 2: ${player2_score}`
}

function Canvas() {

	const [winning_score, setWinning_score] = useState(0);
	const [score_board, setScore_board] = useState("");

	const canvasRef = useRef(null);
	useEffect(() => {
		const canvas: any = canvasRef.current;
		const context = canvas.getContext('2d');
		draw_players(context, 10, 10, 350, 250);

		window.addEventListener('keydown', (e) => {
			if (e.key === up_key && last_send !== 'u') {
				ws.emit('setPosition', 'u');
				last_send = 'u';
			}
			if (e.key === down_key && last_send !== 'd') {
				ws.emit('setPosition', 'd');
				last_send = 'd';
			}
		})

		window.addEventListener('keyup', (e) => {
			if (last_send !== 'o') {
				ws.emit('setPosition', 'o');
				last_send = 'o';
			}
		})

		ws.on('winning_score', (message:string) => {
			setWinning_score(parseInt(message));
		});
		
		ws.on('players', (message:string) => {
			player_status = message;
		});

		ws.on('getPosition', (message: string) => {
			let data = message.split(" ");
			draw_players(context, parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]));
			setScore_board(draw_board(parseInt(data[4]), parseInt(data[5])));
		});

		return () => {
			ws.close();
		}
	}, []);

	return (
		<>
		<div>
		<p>Player status : {player_status}</p>
		<p>Winning score : {winning_score}</p>
		<p>{score_board}</p>
		</div>
		<div className="Canvas">
			<canvas ref={canvasRef} width="700" height="500">
			</canvas>
		</div>
		</>
	);
}

export default Canvas;
