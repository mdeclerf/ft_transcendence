import React, { useEffect, useRef, useState} from 'react';
import { io, Socket } from "socket.io-client";
import Button from '@mui/material/Button';
import { Table } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import { useLocation } from 'react-router-dom';
import { Alert } from '@mui/material';
import { TextField } from '@mui/material';

// const ws = io("http://10.2.6.5:3001");

const up_key: string = "w";
const down_key: string = "s";
let last_send: string = "s";
let player_status: string;
let winning_score: number;
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;
let room_number: string = "";

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

function Canvas(props: any) {
	const ws: Socket = props.socket;;
	console.log("TEST");
	const location = useLocation();
	let ball_color: string = '#000';
	let paddle_color: string = '#000';
	const canvasRef = useRef(null);
	const [room, setRoom] = useState<string>("");
	const [disconnection, setDisconnection] = useState<boolean>(false);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [replay, setReplay] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [firstPScore, setFirstPScore] = useState<string>("0");
	const [secondPScore, setSecondPScore] = useState<string>("0");

	//////////////
	const handleMatchmakingClick = () => {
		ws.emit('add_to_queue');
		setDisabled(true);
	};

	const handlePlayClick = () => {
		ws.emit('play_again', room_number, {player_status});
	};
	///////////////

	const joinRoom = () => {
		if (room !== "") {
			ws.emit("join_room", room);
			room_number = room;
		}
	};

	ws.on("running", (message:string) => {
		if (message === 'true')
			setIsRunning(true);
		if (message === 'false')
			setIsRunning(false);
	});

	ws.on('assigned_room', (message:string) => {
		room_number = message;
	});

	ws.on('winning_score', (message:string) => {
		console.log(message);
		winning_score = parseInt(message);
	});

	ws.on('players', (message:string) => {
		console.log(message);
		player_status = message;
	});

	ws.on('disconnection', (message:string) => {
		setDisconnection(true);
		setIsRunning(false);
	});

	ws.on('replay', (message:string) => {
		setReplay(true);
	});

	useEffect(() => {
		const canvas : any= canvasRef.current;
		canvas.style.backgroundColor = 'white';
		canvas.style.borderRadius = '10px';
		canvas.width = CANVAS_WIDTH;
		canvas.height = CANVAS_HEIGHT;
		const context = canvas.getContext('2d');
		draw_players(context, ball_color, paddle_color, 10, 10, 350, 250);

		window.addEventListener('keydown', (e) => {

			if (e.key === up_key && last_send !== 'u') {
				e.preventDefault();
				ws.emit('setPosition', room_number, 'u');
				last_send = 'u';
			}
			if (e.key === down_key && last_send !== 'd') {
				e.preventDefault();
				ws.emit('setPosition', room_number, 'd');
				last_send = 'd';
			}
		});

		window.addEventListener('keyup', (e) => {
			if (last_send !== 'o' && room_number !== "") {
				e.preventDefault();
				ws.emit('setPosition', room_number, 'o');
				last_send = 'o';
			}
		});

		ws.on('getPosition', (message: string) => {
			setDisabled(false);
			setDisconnection(false);
			setReplay(false);
			let data = message.split(" ");
			draw_players(context, ball_color, paddle_color, parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]));
			setFirstPScore(`First Player ${data[4]}`);
			setSecondPScore(`Second Player ${data[5]}`);
		});

		return () => {
			ws.close();
		}
	// eslint-disable-next-line
	}, []);

	return (
		<Stack spacing={2}>
		<br></br>

		{(location.pathname === "/chatmode") &&
			<div>
				<TextField variant="standard" placeholder="Room Number..."
				onChange={(event: any) => {
					setRoom(event.target.value);
				}}
				/>
				<Button variant="contained" onClick={joinRoom}> Create Room</Button>
			</div>
		}

		{( location.pathname === "/normal" && !isRunning && !disabled) && 
			<Button variant="contained" onClick={handleMatchmakingClick}>I want to play, add me to queue !</Button> 
		}

		{( location.pathname === "/normal" && !isRunning && disabled) && 
			<Button variant="contained" disabled>I want to play, add me to queue !</Button>
		}

		<Table>
			<tbody>
			<TableRow>
				<TableCell sx={{ fontFamily: 'Courier', }}>Player status</TableCell>
				<TableCell sx={{ fontFamily: 'Courier', }} colSpan={2}>{player_status}</TableCell>
			</TableRow>

			<TableRow>
				<TableCell sx={{ fontFamily: 'Courier', }}>Winning score</TableCell>
				<TableCell sx={{ fontFamily: 'Courier', }} colSpan={2}>{winning_score}</TableCell>
			</TableRow>

			<TableRow>
				<TableCell sx={{ fontFamily: 'Courier', }}>Scores</TableCell>
				<TableCell sx={{ fontFamily: 'Courier', }}>{firstPScore}</TableCell>
				<TableCell sx={{ fontFamily: 'Courier', }}>{secondPScore}</TableCell>
			</TableRow>
			</tbody>
		</Table>

		{((location.pathname === "/normal" || location.pathname === "/chatmode" ) && disconnection === true) &&
			<div>
			<Alert severity="info">Your opponent left the game...</Alert>
			</div>
		}

		<canvas ref={canvasRef}></canvas>

		{((location.pathname === "/chatmode" && replay && player_status !== "Watching"))&&
			<Button variant="contained" onClick={handlePlayClick}>Play again !</Button>
		}

		</Stack>
	);
}

export default Canvas;
