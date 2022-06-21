import React, {useRef, useEffect} from 'react';
import './App.css';

interface ball {
	ballX: number;
	ballY: number;
	ballSpeedX: number;
	ballSpeedY: number;
}

interface paddle {
	paddleX: number;
	paddleY: number;
	paddleWidth: number;
	paddleHeight: number;
}

interface score {
	player1: number;
	player2: number;
}

const App: React.FC<{}> = () => {
	let canvasRef = useRef<HTMLCanvasElement | null>(null);
	let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

	let paddle1: paddle = { paddleX: 10, paddleY: 250, paddleWidth: 15, paddleHeight: 100};
	let paddle2: paddle = { paddleX: 580, paddleY: 250, paddleWidth: 15, paddleHeight: 100};
	let ball: ball = { ballX: 50, ballY: 50, ballSpeedX: 10, ballSpeedY: 4};

	const makeRectangleShape = (ctx: CanvasRenderingContext2D | null, cX: number, cY:number, width:number, height:number, color:string ) =>
	{
		if(ctx)
		{
			ctx.fillStyle = color; 
			ctx.fillRect( cX, cY,width, height);
		}
	}

	const makeCircleShape = (ctx: CanvasRenderingContext2D | null, cX: number, cY:number, radious:number , angle: number, color:string ) =>
	{
		if(ctx)
		{
			ctx.fillStyle = color; 
			ctx.beginPath();
			ctx.arc(cX, cY, radious, angle, Math.PI*2, true );
			ctx.fill();
		}
	}

	useEffect(() => {
		// Initialize
		if (canvasRef.current) {
			canvasCtxRef.current = canvasRef.current.getContext('2d');
			let ctx = canvasCtxRef.current;
			makeRectangleShape(ctx,  paddle1.paddleX,  paddle1.paddleY, paddle1.paddleWidth, paddle1.paddleHeight, 'blue' );
			makeRectangleShape(ctx,  paddle2.paddleX,  paddle1.paddleY, paddle2.paddleWidth, paddle2.paddleHeight, 'blue' );
			makeCircleShape(ctx, ball.ballX, ball.ballY, 10, 0, 'yellow')
		}
		}, []);

	return <canvas
	style={{border : "1px solid #000"}}
	width={600}
	height={600}
	ref={canvasRef}>
	</canvas>;
};

export default App;
