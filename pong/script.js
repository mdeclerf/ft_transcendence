// // Update Loop
// import Ball from './Ball'

// const ball: any = new Ball(document.getElementById("ball"));

// function update(time: number)  {
// 	console.log(time)
// 	window.requestAnimationFrame(update)
// }

// window.requestAnimationFrame(update)

import Ball from './Ball.js'
import Paddle from './Paddle.js'

const ball = new Ball(document.getElementById("ball"));
const playerPaddle = new Paddle(document.getElementById("player_paddle"))
const computerPaddle = new Paddle(document.getElementById("computer_paddle"))

let lastTime;

function update(time)  {
	if(lastTime != null)
	{
		const delta = time - lastTime;
		ball.update(delta); // all movements based on delta
		computerPaddle.update(delta, ball.y);
	}
	lastTime = time;
	window.requestAnimationFrame(update)
}

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
document.addEventListener("mousemove", e => {
	playerPaddle.position = (e.y / window.innerHeight) * 100; // position --> %
})

//https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
window.requestAnimationFrame(update)