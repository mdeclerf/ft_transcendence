import React from 'react';
import { useEffect, useState, useRef } from 'react';
import './App.css';
import { Socket, io } from "socket.io-client";

const H: number = 100;
const W: number = 15;
const paddX: number = 100;

let socket: Socket = io('http://localhost:3001/');

const App = () => {
	
	let canvas: HTMLCanvasElement;
	let ctx: any;
	let canvasRef = useRef<HTMLCanvasElement>(null);
	let hint: string = "init";

	const draw = (y: number) => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'blue';
		ctx.fillRect(paddX, y, W, H);
	}

	const test1 = (e: any) => {
		if (e.code === "ArrowUp") {
			socket.emit("send_message", "move_up");
			console.log("up");
			hint = "up";
		}
		else if (e.code === "ArrowDown") {
			socket.emit("send_message", "move_down");
			console.log("up");
			hint = "down";
		}
	}

	const test2 = (e: any) => {
		if (e.code === "ArrowDown" || e.code === "ArrowUp") {
			socket.emit("send_message", "stop");
			console.log("stop");
			hint = "stop";
		}
	}
		
	useEffect(() => {
		console.log("entered");

		if(canvasRef.current) {
			canvas = canvasRef.current;
			ctx = canvas.getContext('2d');
		};

		// socket.on("receive_message", (data) => {
		// 	draw(data.message);
		// });

		window.addEventListener('keydown', test1);

		window.addEventListener('keyup', test2);

		return () => {
			window.removeEventListener('keydown', test1);
			window.removeEventListener('keyup', test2);
		};
	},[]);

	return (<canvas ref = {canvasRef} width = "1000" height = "600" />);
};

export default App;
