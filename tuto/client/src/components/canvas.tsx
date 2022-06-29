
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import './App.css';
import socketio, { Socket, io } from "socket.io-client";
import { syncBuiltinESMExports } from 'module';

interface Paddle {
	x:number,
	y:number,
	width:number,
	height:number,
	dy:number,
	speed: number
}

const H: number = 100;
const W: number = 15;
const paddX: number = 100;
let first: boolean = true;

let socket: Socket;
function Canvas() {
	
	// const sendMessage = () => {
		// 	socket.emit("send_message", message);
		// 	console.log('in send message', message);
		// };
		
		// const [message, setMessage] = useState("");
		const [messageReceived, setMessageReceived] = useState("");
		
		let canvas: HTMLCanvasElement;
		let ctx: any;
		let canvasRef = useRef<HTMLCanvasElement>(null);
		let padd:Paddle;
		
		const draw = (y: number) => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'blue';
			ctx.fillRect(paddX, y, W, H);
		}
		
	useEffect(() => {
		if(!first)
			return;
		socket = io('http://localhost:3001/')
		if(canvasRef.current) {
			canvas = canvasRef.current;
			ctx = canvas.getContext('2d');
		};

		padd = { x: canvas.width / 2, y: canvas.height / 2, width: 15, height: 100, dy: 0, speed: 6};

		socket.on("receive_message", (data) => {
			setMessageReceived(data.message);
			// console.log('in receive message', data.message);
			draw(data.message);
		});

		window.addEventListener('keydown', (e) => {
			if (e.code === "ArrowUp") {
			//   padd.dy = -padd.speed;
			  socket.emit("send_message", "move_up");
			  console.log("up");
			}
			else if (e.code === "ArrowDown") {
			//   padd.dy = padd.speed;
			  socket.emit("send_message", "move_down");
			  console.log("down");
			}
		});

		window.addEventListener('keyup', (e) => {
			if (e.code === "ArrowDown" || e.code === "ArrowUp") {
			//   padd.dy = 0;
			  socket.emit("send_message", "stop");
			  console.log("stop");
			}
		});

		return () => {
			socket.close();
		}

	}, []);

	return (<canvas ref = {canvasRef} width = "1000" height = "600" />);
};

export default Canvas;
