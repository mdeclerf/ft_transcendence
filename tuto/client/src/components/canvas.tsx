import React, { useEffect, useRef, useState} from 'react';
import '../styles.css';
import { io } from "socket.io-client";

const ws = io("http://localhost:3001");
// const ws = io("http://10.2.6.5:3001");
const up_key: string = "w";
const down_key: string = "s";
let last_send: string = "s";
let player_status: string;
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;

const draw_players = (context:any, player1_y: number, player2_y: number, ball_x: number, ball_y: number) => {
	context.clearRect(-100, -100, context.canvas.width + 100, context.canvas.height + 100);
	context.fillStyle = '#F7B008';
	context.fillRect(ball_x -5, ball_y - 5, 10, 10);
	context.fill();
	context.fillStyle = '#08F7B0';
	context.fillRect(10, player1_y, 10, 60);
	context.fillRect(context.canvas.width - 20, player2_y, 10, 60);
}

const draw_board = (player1_score: number, player2_score:number) : string[] => {
	let ret: Array<string> = ["", ""];
	if (player_status === 'Second Player')
	{
		ret[0] = player2_score.toString();
		ret[1] = player1_score.toString();
	}
	else
	{
		ret[0] = player1_score.toString();
		ret[1] = player2_score.toString();
	}
	return ret;
}

function Canvas() {

	const [winning_score, setWinning_score] = useState<number>(0);
	const [score_board, setScore_board] = useState<string[]>([]);

	const canvasRef = useRef(null);

	const handlePlayClick = () => {
		ws.emit('play_again', {player_status});
	};

	useEffect(() => {
		const canvas: any = canvasRef.current;
		canvas.width = CANVAS_WIDTH;
		canvas.height = CANVAS_HEIGHT;
		const context = canvas.getContext('2d');
		draw_players(context, 10, 10, 350, 250);
		
		window.addEventListener('keydown', (e) => {
			if (e.key === up_key && last_send !== 'u') {
				e.preventDefault();
				ws.emit('setPosition', 'u');
				last_send = 'u';
			}
			if (e.key === down_key && last_send !== 'd') {
				e.preventDefault();
				ws.emit('setPosition', 'd');
				last_send = 'd';
			}
		})
		
		window.addEventListener('keyup', (e) => {
			if (last_send !== 'o') {
				e.preventDefault();
				ws.emit('setPosition', 'o');
				last_send = 'o';
			}
		})

		ws.on('winning_score', (message:string) => {
			setWinning_score(parseInt(message));
		});

		ws.on('players', (message:string) => {
			player_status = message;
			console.log(player_status);
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
		<table>
			<tr>
				<th className="name">Player status</th>
				<th className="element" colSpan={2}>{player_status}</th>
			</tr>
			<tr>
				<th className="name">Winning score</th>
				<th className="element" colSpan={2}>{winning_score}</th>
			</tr>
			<tr>
				<th className="name">Scores</th>
				<th className="element">{score_board[0]}</th>
				<th className="element">{score_board[1]}</th>
			</tr>
		</table>
		<br></br>
		</div>
		<div className="Canvas">
			<canvas ref={canvasRef}>
			</canvas>
		</div>
		<br></br>
		<button className='button' type='button' onClick={handlePlayClick}>Play again !</button>
		</>
	);
}

export default Canvas;
