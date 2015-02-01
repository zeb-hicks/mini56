/// utils.js
/// scene.js
/// physics.js
/// particle.js

var KEY_ALT = 18,
	KEY_J = 74,
	KEY_F5 = 116;

Math.HPI = Math.PI / 2;
Math.PI2 = Math.PI * 2;
Math.TAU = Math.PI * 2;

var Game = {};

Game.init = function() {

	document.body.appendChild(Scene.GX.domElement);

	GLOW.defaultCamera.localMatrix.setPosition(0, 0, 10);
	GLOW.defaultCamera.position.set(0, 0, 10);
	GLOW.defaultCamera.update();

	Game.loop();
	Game.draw();

};

Game.loadList = {};
Game.loadList.list = {};
Game.loadList.add = function(id, type) {
	Game.loadList.list[id] = type !== undefined ? type : 'data';
	Game.loadList.total++;
};
Game.loadList.done = function(id) {
	//Game.loadList.list[id];
	Game.loadList.progress++;
};
Game.loadList.progress = 0;
Game.loadList.total = 0;

Game.clock = {
	loopTime: performance.now(),
	drawTime: performance.now()
};

Game.input = {
	keyboard: {
		keys: []
	},
	mouse: {
		x: -1,
		y: -1,
		dx: 0,
		dy: 0,
		buttons: [],
		locked: false,
		wheel: 0
	},
	gamepad: {
		prev: undefined,
		state: undefined,
		deltas: { axes: [], buttons: [] }
	},
	control: {
		x: 0,
		y: 0,
		jump: 0,
		primary: 0,
		secondary: 0,
		block: 0,
		dodge: 0,
		mode: 0
	}
};

Game.view = {

	resolution: new GLOW.Vector2(window.innerWidth, window.innerHeight)

};

Game.player = {

	position: new GLOW.Vector3(0, 0, 0),
	velocity: new GLOW.Vector3(0, 0, 0),
	state: {}

};

Game.debug = false;

Game.loop = function() {
    "use strict";

	var dt = performance.now() - Game.clock.loopTime;
	Game.clock.loopTime += dt;
	dt /= 1000;
	dt = dt > 0.2 ? 0.2 : dt;

	// Update input
	
	if (navigator.webkitGetGamepads !== undefined) {
		Game.input.gamepad.prev = Game.input.gamepad.state;
		Game.input.gamepad.state = navigator.getGamepads()[0];

		if (Game.input.gamepad.prev !== undefined) {
			Game.input.gamepad.deltas.axes[0] = Game.input.gamepad.state.axes[0] - Game.input.gamepad.prev.axes[0];
			Game.input.gamepad.deltas.axes[1] = Game.input.gamepad.state.axes[1] - Game.input.gamepad.prev.axes[1];
			Game.input.gamepad.deltas.buttons[0] = Game.input.gamepad.state.buttons[0] - Game.input.gamepad.prev.buttons[0];
			Game.input.gamepad.deltas.buttons[1] = Game.input.gamepad.state.buttons[1] - Game.input.gamepad.prev.buttons[1];
			Game.input.gamepad.deltas.buttons[2] = Game.input.gamepad.state.buttons[2] - Game.input.gamepad.prev.buttons[2];
			Game.input.gamepad.deltas.buttons[3] = Game.input.gamepad.state.buttons[3] - Game.input.gamepad.prev.buttons[3];
		}
	}

	// Reset input.
	Game.input.mouse.dx = 0;
	Game.input.mouse.dy = 0;

	if (Game.input.mouse.wheel !== 0) {
		Game.input.mouse.wheel = 0;
	}

	setTimeout(Game.loop, 1);
};

Game.draw = function() {
    "use strict";
	var dt = performance.now() - Game.clock.drawTime;
	Game.clock.drawTime += dt;
	dt /= 1000;
	dt = dt > 0.1 ? 0.1 : dt;
	requestAnimationFrame(Game.draw);

	// Clear the last frame.
	Scene.GX.clear();

};

// Event Handlers

document.body.addEventListener('mousemove', function(e) {
	if (Game.input.mouse.locked) {
		Game.input.mouse.dx += e.webkitMovementX;
		Game.input.mouse.dy += e.webkitMovementY;
	} else {
		if (Game.input.mouse.x == -1 && Game.input.mouse.y == -1) {
			Game.input.mouse.x = e.clientX;
			Game.input.mouse.y = e.clientY;
		}
		Game.input.mouse.dx += e.clientX - Game.input.mouse.x;
		Game.input.mouse.dy += e.clientY - Game.input.mouse.y;
		Game.input.mouse.x = e.clientX;
		Game.input.mouse.y = e.clientY;
	}
});

document.body.addEventListener('mousedown', function(e) { Game.input.mouse.buttons[e.button] = true; });
document.body.addEventListener('mouseup', function(e) { Game.input.mouse.buttons[e.button] = false; });
document.body.addEventListener('contextmenu', function(e) { e.preventDefault(); });
if (window.onwheel !== undefined) {
	document.body.addEventListener('wheel', function(e) { Game.input.mouse.wheel += e.deltaY / 100; });
} else {
	document.body.addEventListener('mousewheel', function(e) { Game.input.mouse.wheel -= e.wheelDeltaY / 120; });
}
document.body.addEventListener('keydown', function(e) { Game.input.keyboard.keys[e.which] = true; if (e.keyCode !== KEY_F5 && !(e.keyCode === KEY_J && e.ctrlKey && e.shiftKey)) e.preventDefault(); });
document.body.addEventListener('keyup', function(e) { Game.input.keyboard.keys[e.which] = false; e.preventDefault(); });
window.addEventListener('focus', function(e) {
});
window.addEventListener('blur', function(e) {
	for (var i = 0; i < Game.input.keyboard.keys.length; i++) Game.input.keyboard.keys[i] = false;
	for (var i = 0; i < Game.input.mouse.buttons.length; i++) Game.input.mouse.buttons[i] = false;
	Game.input.mouse.wheel = 0;
});

// Window Resizing

window.addEventListener('resize', function(e) {
	Game.view.resolution.x = window.innerWidth;
	Game.view.resolution.y = window.innerHeight;
	GX.resize(window.innerWidth, window.innerHeight);
	GX.setupViewport();
});

// Pointer Lock Stuff

function plocked(e) {
	// console.log('POINTER LOCK CHANGED');
	// console.log(e);
	if (document.pointerLockElement === document.body || document.webkitPointerLockElement === document.body) {
		Game.input.mouse.locked = true;
	} else {
		Game.input.mouse.locked = false;
	}
}
document.addEventListener('pointerlockchange', plocked);
document.addEventListener('webkitpointerlockchange', plocked);
document.addEventListener('mozpointerlockchange', plocked);
document.addEventListener('selectstart', function(e) {e.preventDefault();});
document.body.requestPointerLock = document.body.requestPointerLock || document.body.webkitRequestPointerLock || document.body.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.webkitExitPointerLock || document.mozExitPointerLock;
