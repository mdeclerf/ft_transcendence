
import React, {useRef, useEffect, MouseEvent} from 'react';
import './App.css';

interface ball {
	X: number;
	Y: number;
	SpeedX: number;
	SpeedY: number;
}

interface paddle {
	X: number;
	Y: number;
	Width: number;
	Height: number;
}

interface score {
	player1: number;
	player2: number;
	winningscore: number;
	haswon: boolean;
}

interface dimcanvas {
	width: number;
	height: number;
}

const App: React.FC<{}> = () => {

	let canvasRef = useRef<HTMLCanvasElement | null>(null);
	let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

	useEffect(() => {

	let dim: dimcanvas = { width: 800, height: 600};
	let paddle1: paddle = { X: 10, Y: dim.height / 2 - 50, Width: 15, Height: 100};
	let paddle2: paddle = { X: dim.width - 25, Y: dim.height / 2 - 50 , Width: 15, Height: 100};
	let score: score = { player1: 0, player2: 0, winningscore: 3, haswon: false};
	let ball: ball = { X: dim.width / 2, Y: dim.height/2, SpeedX: 10, SpeedY: 4};

	if (canvasRef.current) {
		canvasCtxRef.current = canvasRef.current.getContext('2d');
	}
	let ctx = canvasCtxRef.current;

	const makeRectangleShape = (cX: number, cY:number, width:number, height:number, color:string ) =>
	{
		if(ctx)
		{
			ctx.fillStyle = color; 
			ctx.fillRect( cX, cY, width, height);
		}
	}

	const makeCircleShape = (cX: number, cY:number, radious:number , angle: number, color:string ) =>
	{
		if(ctx)
		{
			ctx.fillStyle = color; 
			ctx.beginPath();
			ctx.arc(cX, cY, radious, angle, Math.PI*2, true );
			ctx.fill();
		}
	}

	const makescores = () => {
		if(ctx)
		{
			ctx.font = '25px serif';
			ctx.fillStyle = 'black';
			ctx.fillText(("Score: " + score.player1 ), 100, 30);
			ctx.fillText(("Score: " + score.player2 ), dim.width - 150, 30);
		}
	}

	const computerAi = () => {
		let paddle2YCenter: number = paddle2.Y + (paddle2.Height / 2) ;
		if(paddle2YCenter < ball.Y - 40) { paddle2.Y += 13 }
		 else if(paddle2YCenter < ball.Y + 40) { paddle2.Y -= 13 }
	}

	const move = () => {
		if(score.haswon)
		{
			if(score.player1 >= score.winningscore && ctx)
			{
				ctx.font = '25px serif';
				ctx.fillStyle = 'black';
				ctx.fillText("Player 1 wins", dim.height / 4 , 50);
			}
			if(score.player2 >= score.winningscore && ctx)
			{
				ctx.font = '25px serif';
				ctx.fillStyle = 'black';
				ctx.fillText("Player 2 wins", dim.height / 4 , 50);
			}
			return;
		}

		computerAi();

		ball.X += ball.SpeedX;
		ball.Y += ball.SpeedY;

		if(ball.X > dim.height) { //Bouncing the ball in the X Axix      ballSpeedX = -ballSpeedX
			if( ball.Y > paddle2.Y && ball.Y < (paddle2.Height + paddle2.Y))
			{
				ball.SpeedX = - ball.SpeedX; 
				let deltaY = ball.Y - (paddle2.Y + paddle2.Height / 2);
				ball.SpeedY = deltaY * 0.35;
			}
			else
			{
				score.player1 += 1;
				ballReset();
			}
		}

		if(ball.Y > 590) { ball.SpeedY = -ball.SpeedY }  //Bouncing the ball in the Y Axix
		if(ball.Y < 10) { ball.SpeedY = -ball.SpeedY }
	}

	const ballReset = () => {
		if (score.player1 >= score.winningscore || score.player2 >= score.winningscore ) { score.haswon = true; }

		ball.SpeedX =- ball.SpeedX;
		ball.X = dim.width / 2;
		ball.Y = dim.height / 2;
	}

	const draw = () => {
		makeRectangleShape( paddle1.X,  paddle1.Y, paddle1.Width, paddle1.Height, 'blue' );
		makeRectangleShape( paddle2.X,  paddle1.Y, paddle2.Width, paddle2.Height, 'blue' );
		makeCircleShape( ball.X, ball.Y, 10, 0, 'yellow');
		makescores();
	}

	
	setInterval(() => {
		draw();
		move();
	}, 1000 / 40);
	
}, []);

	const handleEvent = (event: MouseEvent) => {
		event.preventDefault();
		if (event.type === "mousedown") {
			console.log('DOWN');
		} else {
			console.log("up");
		}
	}

	return (<canvas
	id = 'canvas'
	style={{border : "1px solid #000"}}
	width={800}
	height={600}
	onMouseDown={handleEvent}
	ref={canvasRef}></canvas>);
};

export default App;
