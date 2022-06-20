import React , { useRef, useEffect } from 'react';
import './App.css';

interface CanvasProps {
	width: number;
	height: number;
}

function canvas() {
	const Canvas = () => {
		const canvasRef = useRef<HTMLCanvasElement>(null);
	
		useEffect(() => {
			if (canvasRef.current) {
				const canvas = canvasRef.current;
				const context = canvas.getContext('2d');  
			}
		},[]);
		return <canvas ref="canvas" width={800} height={600}/> ;
	};
}

class App extends React.Component{
	

	updateCanvas() {
		const framesPerSecond: number = 40;
		let ballX: number = 50;  // Ball initial: location, speed
		let ballY: number = 50;
		let ballSpeedX: number = 10;
		let ballSpeedY: number = 4;
		const winningScore: number = 3;
		const paddleColorX2: any = "black";
		let player1Score: number = 0;
		let player2Score: number = 0;
		let showWinScreen: boolean = true;

		const paddleHeight: number = 100; // Padles Measurements.
		const paddleWidth: number = 15;
		let paddle1Y: number = 100;  // User paddle Location.
		let paddle2Y: number = 250; // Machine Paddle Location

		const makeRectangle = (cx: number, cY: number, width: number, height: number, color: number) => {

		}

	}

	render() {
		return (
			<canvas ref="canvas" width={800} height={600}/>
		);
	}
}

export default App;
