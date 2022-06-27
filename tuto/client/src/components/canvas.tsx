// import React, {useRef, useEffect, useState} from 'react';
// import io from 'socket.io-client';
// import './styles.css'

// let paddleSpeed = 6;
// let ballSpeed = 4;
// let canvas: HTMLCanvasElement;
// let ctx: any;

// interface Score {
// 	L: number,
// 	R: number,
// 	winning_score: number,
// 	haswon: boolean
// }

// interface Paddle {
// 	x:number,
// 	y:number,
// 	width:number,
// 	height:number,
// 	dy:number,
// }

// interface Ball {
// 	x:number,
// 	y:number,
// 	width:number,
// 	height:number,
// 	dy:number,
// 	dx:number,
// 	reset:boolean
// }

// const collision = (obj1: Ball, obj2: Paddle) => {
//     return obj1.x < obj2.x + obj2.width &&
//         obj1.x + obj1.width > obj2.x &&
//         obj1.y < obj2.y + obj2.height &&
//         obj1.y + obj1.height > obj2.y;
// }

// const handleWin = (animationId: number, score:Score) => {
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// 	cancelAnimationFrame(animationId);
// 	ctx.fillStyle = 'yellow';
// 	ctx.fillRect(0, 0, canvas.width, canvas.height);
// 	ctx.textBaseline = 'middle';
// 	ctx.textAlign = 'center';
// 	ctx.fillStyle = 'blue';
// 	ctx.font = '80px Arial';
// 	if (score.R >= score.winning_score)
// 		ctx.fillText("COMPUTER WINS", canvas.width / 2, canvas.height / 2);
// 	else if (score.L >= score.winning_score)
// 		ctx.fillText("YOU WIN", canvas.width / 2, canvas.height / 2);
// }

// const Canvas = () => {
// 	let canvasRef = useRef<HTMLCanvasElement>(null);
// 	let leftPaddle:Paddle;
// 	let rightPaddle:Paddle;
// 	let ball:Ball;
// 	let score:Score;

// 	/************************ play button set up *************************/
// 	let [playButton, setPlayButton] = useState(false);
// 	let [start, setStart] = useState(0);

// 	const handlePlayClick = () => {
// 		if (start === 0)
// 			setStart(start += 1);
// 		setPlayButton(current => !current)
// 	};

// 	/************************ hook *************************/
// 	useEffect(() => {
// 		if(canvasRef.current) {
// 			canvas = canvasRef.current;
// 			ctx = canvas.getContext('2d');
// 		};
		
// 		leftPaddle = { x: 15, y: canvas.height / 2, width: 15, height: 100, dy: 0};
// 		rightPaddle = { x: canvas.width - 15, y: canvas.height / 2, width: 15, height: 100, dy: 0 };
// 		ball = { x: canvas.width / 2, y: canvas.height / 2, width: 15, height: 15, dy: ballSpeed, dx: -ballSpeed, reset: false};
// 		score = { L:0, R:0, winning_score: 3, haswon: false };

// 		/************************ keys listener *************************/
// 		window.addEventListener('keydown', (e) => {
// 			if (e.code === "ArrowUp") {
// 			  leftPaddle.dy = -paddleSpeed;
// 			}
// 			else if (e.code === "ArrowDown") {
// 			  leftPaddle.dy = paddleSpeed;
// 			}
// 		});

// 		window.addEventListener('keyup', (e) => {
// 			if (e.code === "ArrowDown" || e.code === "ArrowUp") {
// 			  leftPaddle.dy = 0;
// 			}
// 		});

// 		/************************ start *************************/
// 		if (playButton === false && start === 0)
// 		{
// 			ctx.fillStyle = 'blue';
// 			ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
// 			ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
// 			let net = 8;
// 			for (let i = net; i < canvas.height; i += net * 2) {
// 				ctx.fillStyle = 'yellow';
// 				ctx.fillRect(canvas.width / 2 - (net / 2), i, net, net);
// 			};
// 		}

// 		if (playButton === true)
// 			loop();

// 	}, [handlePlayClick]);

// 	const loop = () => {
// 		let animationId: number = requestAnimationFrame(loop); // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
// 		ctx.clearRect(0, 0, canvas.width, canvas.height);
// 		leftPaddle.y += leftPaddle.dy;
// 		rightPaddle.y += rightPaddle.dy;

// 		/************************ make sure the paddle stays within the canvas height *************************/
// 		if(leftPaddle.y < 0)
// 			leftPaddle.y = 0;
// 		else if (leftPaddle.y > canvas.height - leftPaddle.height)
// 			leftPaddle.y = canvas.height - leftPaddle.height;
// 		if(rightPaddle.y < 0)
// 			rightPaddle.y = 0;
// 		else if (rightPaddle.y > canvas.height - rightPaddle.height)
// 			rightPaddle.y = canvas.height - rightPaddle.height;

// 		/************************ fill all the elements *************************/
// 		ctx.fillStyle = 'blue';
// 		ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
// 		ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

// 		let net = 8;
// 		for (let i = net; i < canvas.height; i += net * 2) {
// 			ctx.fillStyle = 'yellow';
// 			ctx.fillRect(canvas.width / 2 - (net / 2), i, net, net);
// 		};

// 		ctx.fillStyle = 'black';
// 		ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

// 		if (score.L < score.winning_score && score.R < score.winning_score)
// 		{
// 			ctx.fillStyle = 'blue';
// 			ctx.font = '50px Arial';
// 			ctx.fillText(score.L, canvas.width / 2 - 150, 60);
// 			ctx.fillText(score.R, canvas.width / 2 + 150, 60);
// 		}

// 		/************************ animate the ball *************************/
// 		ball.x += ball.dx;
// 		ball.y += ball.dy;

// 		/************************ ai R paddle *************************/
// 		rightPaddle.dy = ball.dy;

// 		/************************ ball walls bouncing *************************/
// 		if(ball.y < 0)
// 		{
// 			ball.y = 0 + ball.height;
// 			ball.dy *= -1;
// 		} 
// 		else if (ball.y > canvas.height - ball.height)
// 		{
// 			ball.y = canvas.height - ball.height;
// 			ball.dy *= -1;
// 		}

// 		/************************ scores *************************/
// 		if((ball.x < 0 || ball.x > canvas.width) && !ball.reset) {

// 			ball.reset = true;
// 			if (ball.x < 0)
// 				score.R += 1;
// 			else if (ball.x > canvas.width)
// 				score.L += 1;

// 			if (score.L >= score.winning_score || score.R >= score.winning_score)
// 			{
// 				handleWin(animationId, score);
// 				setPlayButton(current => !current);
// 				score.R = 0;
// 				score.L = 0;
// 			}

// 			setTimeout(() => {
// 				ball.reset = false;
// 				ball.x = canvas.width / 2;
// 				ball.y = canvas.height / 2;
// 				}, 100);
// 		};

// 		/************************ ball paddle bouncing *************************/
// 		if(collision(ball, leftPaddle)) {
// 			ball.dx *= -1;
// 			ball.x = leftPaddle.x + leftPaddle.width;
// 		}
// 		else if (collision(ball, rightPaddle)) {
// 			ball.dx *= -1;
// 			ball.x = rightPaddle.x - ball.width;
// 		}
// 	}

// 	return (
// 	<>
// 	<button className='button' type='button' onClick={handlePlayClick}>PLAY</button>
// 	<canvas ref = {canvasRef} width = "1000" height = "600" />
// 	</>
// 	);
// };

// export default Canvas;

///////////////////////////////////////////////////////////////////

import React, {useRef, useEffect, useState} from 'react';
import io from 'socket.io-client';
import './styles.css'

let paddleSpeed = 6;
let canvas: HTMLCanvasElement;
let ctx: any;

interface Paddle {
	x:number,
	y:number,
	width:number,
	height:number,
	dy:number,
}

const Canvas = () => {
	let canvasRef = React.useRef<HTMLCanvasElement>(null);
	let socketRef = React.useRef<any>(null);
	let leftPaddle:Paddle;

	/************************ hook *************************/
	useEffect(() => {

		if(canvasRef.current) {
			canvas = canvasRef.current;
			ctx = canvas.getContext('2d');
		};

		leftPaddle = { x: 15, y: canvas.height / 2, width: 15, height: 100, dy: 0};

		/************************ keys listener *************************/
		window.addEventListener('keydown', (e) => {
			if (e.code === "ArrowUp") {
				leftPaddle.dy = -paddleSpeed;
			}
			else if (e.code === "ArrowDown") {
				leftPaddle.dy = paddleSpeed;
			}
		});

		window.addEventListener('keyup', (e) => {
			if (e.code === "ArrowDown" || e.code === "ArrowUp") {
				leftPaddle.dy = 0;
			}
		});

		/************************ draw lines *************************/
		const drawRectangle = (paddle:Paddle) => {
			ctx.fillStyle = 'blue';
			ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
			socketRef.current.emit('drawing');
		};

		const onKeyEvent = (paddle:Paddle) => {
			drawRectangle(paddle);
		}

		if (socketRef.current)
		{
			socketRef.current = io('http://localhost:3000');
			socketRef.current.on('drawing', onKeyEvent);
		}
	}, []);

	return (
	<canvas ref = {canvasRef} width = "1000" height = "600" />
	);
};

export default Canvas;
