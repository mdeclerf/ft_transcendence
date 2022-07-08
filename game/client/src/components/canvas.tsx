import React, { useEffect, useRef, useState} from 'react';
import { io } from "socket.io-client";
import Button from '@mui/material/Button';
import { Slider } from '@mui/material';
import { Table } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';

const ws = io("http://localhost:3001");
// const ws = io("http://10.2.6.5:3001");
const up_key: string = "w";
const down_key: string = "s";
let last_send: string = "s";
let player_status: string;
let winning_score: number;
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;

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

const draw_players = (context:any, ball_color: string, paddle_color: string, player1_y: number, player2_y: number, ball_x: number, ball_y: number) => {
	context.clearRect(-100, -100, context.canvas.width + 100, context.canvas.height + 100);
	context.fillStyle = ball_color;
	context.fillRect(ball_x -5, ball_y - 5, 10, 10);
	context.fill();
	context.fillStyle = paddle_color;
	context.fillRect(10, player1_y, 10, 60);
	context.fillRect(context.canvas.width - 20, player2_y, 10, 60);
	let net = 8;
	for (let i = net; i < CANVAS_HEIGHT; i += net * 2) {
		context.fillStyle = ball_color;
		context.fillRect(CANVAS_WIDTH / 2 - (net / 2), i, net, net);
	};
}

function Canvas() {
	let ball_color: string = '#000';
	let paddle_color: string = '#000';

	const [score_board, setScore_board] = useState<string[]>(['0','0']);
	const [ball_speed, setBall_speed] = useState<number | number[]>(10);
	const canvasRef = useRef(null);

	const handlePlayClick = () => {
		ws.emit('play_again', {player_status});
	};

	const handleSpeedChange = (event: Event, value: number | number[]) => {
		setBall_speed(value);
		ws.emit('set_speed', {ball_speed});
	};

	useEffect(() => {
		const canvas: any = canvasRef.current;
		canvas.style.backgroundColor = 'white';
		canvas.style.borderRadius = '10px';
		canvas.width = CANVAS_WIDTH;
		canvas.height = CANVAS_HEIGHT;
		const context = canvas.getContext('2d');
		draw_players(context, ball_color, paddle_color, 10, 10, 350, 250);

		ws.on('winning_score', (message:string) => {
			winning_score = parseInt(message);
		});

		ws.on('players', (message:string) => {
			player_status = message;
		});

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
		});

		window.addEventListener('keyup', (e) => {
			if (last_send !== 'o') {
				e.preventDefault();
				ws.emit('setPosition', 'o');
				last_send = 'o';
			}
		});

		ws.on('getPosition', (message: string) => {
			let data = message.split(" ");
			draw_players(context, ball_color, paddle_color, parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]));
			setScore_board(draw_board(parseInt(data[4]), parseInt(data[5])));
		});

		return () => {
			ws.close();
		}
		// eslint-disable-next-line
	}, []);

	return (
		<>
		<Stack spacing={2}>


		<Table>
			<tbody>
			<TableRow>
				<TableCell>Player status</TableCell>
				<TableCell colSpan={2}>{player_status}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>Winning score</TableCell>
				<TableCell colSpan={2}>{winning_score}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>Scores</TableCell>
				<TableCell>{score_board[0]}</TableCell>
				<TableCell>{score_board[1]}</TableCell>
			</TableRow>
			</tbody>
		</Table>

		{(player_status !== "Watching") &&
			<div>
			<h5>Adjust the speed of the ball</h5>
			<Slider
			aria-label="Small steps"
			defaultValue={10}
			value={ball_speed}
			onChange={handleSpeedChange}
			step={2}
			marks={true}
			min={5}
			max={20}
			valueLabelDisplay="auto"
		/></div> }

		<canvas ref={canvasRef}></canvas>
		{(player_status !== "Watching" && (parseInt(score_board[0]) >= winning_score || parseInt(score_board[1]) >= winning_score)) &&
			<Button variant="contained" onClick={handlePlayClick}>Play again !</Button> }
		</Stack>
		</>
	);
}

export default Canvas;
