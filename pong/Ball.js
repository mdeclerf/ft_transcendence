// export default class Ball {

// 	ballElem: any;
// 	constructor(ballElem: any) {
// 		this.ballElem = ballElem;
// 	}
// }
const INITIAL_VELOCITY = .025
const VELOCITY_INCREASE = .00001

export default class Ball {
	constructor(ballElem) {
		this.ballElem = ballElem;
		this.reset();
	}

	get x() {
		return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
	}

	get y() {
		return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
	}

	set x(value) {
		this.ballElem.style.setProperty("--x", value);
	}

	set y(value) {
		this.ballElem.style.setProperty("--y", value);
	}

	rect() {
		return this.ballElem.getBoundingClientRect()
	}

	reset(){
		this.x = 50;
		this.y = 50;
		this.direction = {x: 0 } // unit vector * velocity, only thing determins how fast we go
		while(Math.abs(this.direction.x) <= .2 || Math.abs(this.direction.x) >= .9) // 
		{
			const heading = randomNumberBetween(0, 2 * Math.PI);
			this.direction = { x: Math.cos(heading), y: Math.sin(heading)};
		}
		console.log(this.direction);
		this.velocity = INITIAL_VELOCITY;
	}

	update(delta, paddleRects) {
		this.x += this.direction.x * this.velocity * delta;
		this.y += this.direction.y * this.velocity * delta;
		this.velocity += VELOCITY_INCREASE * delta;
		const rect = this.rect();
		if(rect.bottom >= window.innerHeight || rect.top <= 0) // bounce top and bottom side screen
		{
			this.direction.y *= -1;
		}

		if(paddleRects.some(r => isCollision(r, rect))) {
			this.direction.x *= -1;
		} // function loops through different paddles, if any return true, true for entire thing
	}
}

function isCollision(rect1, rect2) {
	return (rect1.left <= rect2.right && 
	rect1.right >= rect2.left && 
	rect1.top <= rect2.bottom &&
	rect1.bottom >= rect2.top)
}

function randomNumberBetween(min, max) {
	return Math.random() * (max-min) + min;
}