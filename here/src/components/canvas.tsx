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

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const collision = (obj1: Ball, obj2: Paddle) => {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

const Canvas = () => {
	let canvasRef = useRef<HTMLCanvasElement>(null);
	let leftPaddle:Paddle; // player
	let rightPaddle:Paddle; // computer
	let ball:Ball;
	let score:Score;
	let ON: boolean = false;

	useEffect(() => {
		if(canvasRef.current) {
			canvas = canvasRef.current;
			ctx = canvas.getContext('2d');
		};

		leftPaddle = { x: 15, y: canvas.height / 2, width: 15, height: 100, dy: 0};
		rightPaddle = { x: canvas.width - 15, y: canvas.height / 2, width: 15, height: 100, dy: 0 };
		ball = { x: canvas.width / 2, y: canvas.height / 2, width: 15, height: 15, dy: ballSpeed, dx: -ballSpeed, reset: false};
		score = { player:0, computer:0, winning_score: 4, haswon: false };

		function start_playing () {
			ON = true;
		}

		window.addEventListener('keydown', (e) => {
			if (e.code === "ArrowDown") {
			  leftPaddle.dy = -paddleSpeed;
			}
			else if (e.code === "ArrowUp") {
			  leftPaddle.dy = paddleSpeed;
			}
		});

		window.addEventListener('keyup', (e) => {
			if (e.code === "ArrowDown" || e.code === "ArrowUp") {
			  leftPaddle.dy = 0;
			}
		});

		window.addEventListener('keyup', (e) => {
			if (e.code === "ArrowDown" || e.code === "ArrowUp") {
			  leftPaddle.dy = 0;
			}
		});

		if(ON = true)
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

		rightPaddle.dy = ball.dy;

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

		if((ball.x < 0 || ball.x > canvas.width) && !ball.reset) {

			ball.reset = true;
			if (ball.x < 0)
				score.player += 1;
			else if (ball.x > canvas.width)
				score.computer += 1;

			if (score.player >= score.winning_score || score.computer >= score.winning_score)
			{
				score.computer = 0;
				score.player = 0;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = 'blue';
				ctx.font = '50px Arial';
				if (score.player >= score.winning_score)
					ctx.fillText("YOU WIN", canvas.width / 2 - 200, canvas.height / 2);
				else
					ctx.fillText("COMPUTER WINS", canvas.width / 2 - 200, canvas.height / 2);
			}
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
			ball.x = rightPaddle.x - ball.width;
		}

		let net = 8;
		for (let i = net; i < canvas.height; i += net * 2) {
			ctx.fillStyle = 'yellow';
			ctx.fillRect(canvas.width / 2 - (net / 2), i, net, net);
		};

		ctx.fillStyle = 'black';
		ctx.fillRect(ball.x, ball.y, ball.width, ball.height);


		if (score.player < score.winning_score && score.computer < score.winning_score)
		{
			ctx.fillStyle = 'blue';
			ctx.font = '50px Arial';
			ctx.fillText(score.player, canvas.width / 2 + 150, 60);
			ctx.fillText(score.computer, canvas.width / 2 - 150, 60);
		}
	}

	return ( 
	<button className='button' onClick={start_playing}>
	Start playing !
	</button>
	<canvas ref = {canvasRef} width = "1000" height = "600" />)
};

export default Canvas;