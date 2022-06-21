import { lookup } from 'dns';
import React, {useRef, useEffect, MouseEvent} from 'react';

let paddleSpeed = 6;
let ballSpeed = 4;
let canvas: HTMLCanvasElement;
let ctx: any;

interface Score {
	player: number,
	computer: number,
	winning_score: number,
	haswon: boolean
}

interface Paddle {
	x:number,
	y:number,
	width:number,
	height:number,
	dy:number,
}

interface Ball {
	x:number,
	y:number,
	width:number,
	height:number,
	dy:number,
	dx:number,
	reset:boolean
}

const collision = (ball: Ball, paddle: Paddle) =>
{
	return ball.x < paddle.x + paddle.width &&
	ball.x + ball.width > paddle.x &&
	ball.x < paddle.x + paddle.height &&
	ball.x + ball.height > paddle.x
}

const Canvas = () => {
	let canvasRef = useRef<HTMLCanvasElement>(null);
	let leftPaddle:Paddle; // player
	let rightPaddle:Paddle; // computer
	let ball:Ball;
	let score:Score;

	useEffect(() => {
		if(canvasRef.current) {
			canvas = canvasRef.current;
			ctx = canvas.getContext('2d');
		};

		leftPaddle = { x: 15, y: canvas.height / 2, width: 15, height: 100, dy: 0};
		rightPaddle = { x: canvas.width - 15, y: canvas.height / 2, width: 15, height: 100, dy: 0 };
		ball = { x: canvas.width / 2, y: canvas.height / 2, width:30, height:30, dy: ballSpeed, dx: -ballSpeed, reset: false};
		score = { player:0, computer:0, winning_score: 4, haswon: false };

		window.addEventListener('keydown', (e) => {
			if(e.key == 'Arrow Up')
				leftPaddle.dy = -paddleSpeed;
			else if (e.key == 'Arrow Down')
				leftPaddle.dy = paddleSpeed;
		});

		window.addEventListener('keyup', (e) => {
			if(e.key == 'Arrow Up' || e.key == 'Arrow Down')
				leftPaddle.dy = 0;
		});
		loop();
	}, []);

	const loop = () => {
		requestAnimationFrame(loop); // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		leftPaddle.y += leftPaddle.dy;
		rightPaddle.y += rightPaddle.dy;

		if(leftPaddle.y < 0) // to make sure the paddle dont go to hight or too low
			leftPaddle.y = 0;
		else if (leftPaddle.y > canvas.height - leftPaddle.height)
			leftPaddle.y = canvas.height - leftPaddle.height;
		if(rightPaddle.y < 0)
			rightPaddle.y = 0;
		else if (rightPaddle.y > canvas.height - rightPaddle.height)
			rightPaddle.y = canvas.height - rightPaddle.height;

		ctx.fillStyle = 'blue';
		ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
		ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

		ball.x += ball.dx;
		ball.y += ball.dy;

		if(ball.y < 0) // to make the ball bounnnnce 
		{
			ball.y = 0 + ball.height;
			ball.dy *= -1;
		} 
		else if (ball.y > canvas.height - ball.height)
		{
			ball.y = canvas.height - ball.height;
			ball.dy *= -1;
		}

		if((ball.x < 0 || ball.x > canvas.width) && ball.reset == false) {
			ball.reset = true;
			setTimeout(() => {
				ball.reset = false;
				ball.x = canvas.width / 2;
				ball.y = canvas.height / 2;
			}, 100);
		};

		if(collision(ball, leftPaddle)) {
			ball.dx *= -1;
			ball.x = leftPaddle.x + leftPaddle.width;
		}
		else if (collision(ball, rightPaddle)) {
			ball.dx *= -1;
			ball.x = rightPaddle.x - rightPaddle.width;
		}

		ctx.fillStyle = 'yellow';
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, 10, 0, Math.PI*2, true );
		ctx.fill();
	}

	return <canvas ref = {canvasRef} width = "1000" height = "600" />
};

export default Canvas;