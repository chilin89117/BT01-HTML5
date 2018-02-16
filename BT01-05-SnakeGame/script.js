$(document).ready(function () {
	
	// getContext() is a JS function of the HTMLCanvasElement
	// so select the first element in $("#canvas")	
	var c = $("#canvas")[0];
	var ctx = c.getContext("2d");
	
	var w = c.width;						// dimensions of canvas
	var h = c.height;
	var cw = 15;								// dimension of one square cell of snake or food
	var snakeDirection;
	var food;									// represented as a single square cell
	var score;
	var speed = 100;						// refresh screen at 100ms intervals
	var snakeColor = "yellow";
	var snakeBorder = "red";
	var snakeLength = 5;
	var snakeArray = [];				// array of squares to represent snake
	var canvasBg = "black";
	var canvasBorder = "white";
	var gameLoop;
	
	function init() {
		
		// initialize direction, create snake and food, and set score at 0
		snakeDirection = "right";
		createSnake();
		createFood();
		score = 0;
		
		// start game in motion
		if (typeof gameLoop != "undefined") {
			clearInterval(gameLoop);
		}
		
		// setInterval runs paint() at speed interval and returns an id in 
		// gameLoop which can be cleared if paint() is already running
		gameLoop = setInterval(paint, speed)
	}
	
	// start game
	init();
	
	function createSnake() {
		for (var i = snakeLength - 1; i >= 0; i--) {
			
			// create snake as a series of boxes with the head at 
			// (snakeLength-1,0) and tail at (0,0) as initial coordinates;
			// in snakeArray, head is at snakeArray[0] and tail is at
			// snakeArray[snakeLength-1]
			snakeArray.push({x:i,y:0});
		}		
	}
	
	function createFood() {
		
		// randomly position food as a 1 cell box in the canvas
		food = {
			x:Math.round(Math.random() * (w - cw) / cw),
			y:Math.round(Math.random() * (h - cw) / cw)		
		};
	}
	
	function paint() {
		
		// draw canvas square with border
		ctx.fillStyle = canvasBg;
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = canvasBorder;
		ctx.lineWidth = "2";
		ctx.strokeRect(0, 0, w, h);
		
		// find position of snake head, and set the x or y coordinate
		// of the new position depending on direction
		var nx = snakeArray[0].x;
		var ny = snakeArray[0].y;
		
		switch(snakeDirection) {
			case "right":
				nx++;
				break;
			case "left":
				nx--;
				break;
			case "up":
				ny--;
				break;
			case "down":
				ny++;
				break;
			default:
				break;
		}
		
		// if the new position is outside the canvas, show the final 
		// score and fade in the overlay
		if (nx < 0 || nx > w/cw || ny < 0 || ny > h/cw) {
			$("#final-score").text(score);
			$("#overlay").fadeIn(1000);
			return;
		}
		
		// place the head at the new position
		var newHead = {x:nx, y:ny};
		
		// if the head coincides with the food position, increment 
		// score and place a new food square in the canvas; otherwise, 
		// remove the tail from last element of snakeArray
		if (nx == food.x && ny == food.y) {
			score++;
			createFood();
		} else {
			snakeArray.pop();
		}

		// place the new head position into snakeArray[0]; if snake runs 
		// into food, tail is not popped and length of snake is increased
		snakeArray.unshift(newHead);
		
		// draw the snake and food using the new array and coordinates
		for (var i = 0; i < snakeArray.length; i++) {
			var cell = snakeArray[i];
			paintCell(cell.x, cell.y);
		}
		
		paintCell(food.x, food.y);
		
		// check and display current score with high score in localStorage
		checkScore(score);
		
		$("#show-score").text("Your Score: " + score);
	}
	
	// draw individual square of cw x cw to represent snake and food 
	function paintCell(x, y) {
		ctx.fillStyle = snakeColor;
		ctx.fillRect(x * cw, y * cw, cw, cw);
		ctx.strokeStyle = snakeBorder;
		ctx.lineWidth = "1";
		ctx.strokeRect(x * cw, y * cw, cw, cw);
	}
	
	function checkScore(currentScore) {
		var hi = localStorage.getItem("highscore");		
		if (hi === null) {
			localStorage.setItem("highscore", score);
		} else {
			if (currentScore > hi) {
				localStorage.setItem("highscore", score);
			}
		}
		
		$("#high-score").text("High Score: " + localStorage.highscore);
	}
	
	// use arrow keys to set direction
	$(document).keydown(function (e) {
		var key = e.which;
		if (key == "37" && snakeDirection != "right") {
			snakeDirection = "left";
		} else if (key == "38" && snakeDirection != "down") {
			snakeDirection = "up";
		} else if (key == "39" && snakeDirection != "left") {
			snakeDirection = "right";
		} else if (key == "40" && snakeDirection != "up") {
			snakeDirection = "down";
		}
	});
});

function resetScore() {
	localStorage.highscore = 0;
	$("#high-score").text("High Score: 0");
}