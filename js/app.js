// Character Superclass
var Character = function () {
	this.x = 0;
	this.y = 0;
	this.speed = '';
	this.score = '';
	this.sprite = '';
};
Character.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Zombies

// Zombies Subclass

var Enemy = function (x, y, speed, sprite) {
	Character.call(this);
	this.x = x;
	this.y = y;
	this.speed = Math.floor((Math.random() * 400) + 100);
	this.sprite = "images/enemy-zombie.png";
};
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;


// Speed of movement across the screen and behavior at canvas edges
Enemy.prototype.update = function (dt) {
	this.x += this.speed * dt; // speed is the same on all computers
	if (this.x > 500) { // whenever a zombie reaches the right edge
		this.x = -100; // a new zombie appears at the left edge
		this.speed = Math.floor((Math.random() * 400) + 100);
	}
};


// The enemy array. The for loop keeps adding zombies
var allEnemies = [];
for (var i = 0; i < 4; i++) {
	allEnemies.push(new Enemy(-100, 70 + (63 * i)));
}


// Player


// Subclass Appearance, position, score
var score = 0;

var Player = function (x, y, score) {
	Character.call(this);
	this.x = x;
	this.y = y;
	this.sprite = 'images/char-ricky.png';
	this.score = score;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;


// Behavior on reaching the park, colliding with a zombie
Player.prototype.update = function () {
	if (this.y <= 40) { // when player reaches the edge of the park
		this.y = 390; // player's position on vertical axis is reset
		this.score += 10; // user's score increases
	}
	this.drawText(); // score is shown above the canvas (see below)
	this.collision(); // this function is defined below
};


// How the user controls the player, using arrow keys
Player.prototype.handleInput = function (key) {
	var horizontalStep = 101;
	var verticalStep = 83;
	if (key === 'up') {
		if (this.y <= 30) {
			this.resetPlayer(); // movement stops at park's edge
		}
		this.y -= verticalStep;
	} else if (key === 'down') {
		if (this.y >= 390) {
			this.resetPlayer(); // movement off bottom is not allowed
		}
		this.y += verticalStep;
	} else if (key === 'left') {
		if (this.x <= 40) {
			this.resetPlayer(); // movement off left side not allowed
		}
		this.x -= horizontalStep;
	} else if (key === 'right') {
		if (this.x >= 400) {
			this.resetPlayer(); // movement off right side not allowed
		}
		this.x += horizontalStep;
	}
};


// The player object
var player = new Player(200, 390, 0);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});


/* Collision */

//checks if objects a and b collide, bounding rectangle routine
var collision = function (a, b) {
	return a.x < (b.x + 50) &&
		(a.x + 50) > b.x &&
		a.y < (b.y + 50) &&
		(a.y + 50) > b.y;
};


// User score on collision with a zombie
Player.prototype.collision = function () {
	for (var i = 0; i < allEnemies.length; i++) {
		if (collision(this, allEnemies[i])) {
			soundEfx.play();
			this.y = 403; // player's vertical location is reset
		}
	}
};


/* Extras */


// Player score on screen
Player.prototype.drawText = function () {
	ctx.fillStyle = '#8B0000';
	ctx.font = '30px Fredericka the Great';
	ctx.clearRect(160, 0, 180, 40);
	ctx.fillText('Score  ' + this.score, 180, 30);
};
