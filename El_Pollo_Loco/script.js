let canvas;
let world;
let keyboard = new Keyboard();


function init(){
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (e) => {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        keyboard.RIGHT = true;
    }
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        keyboard.LEFT = true;
    }
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        keyboard.UP = true;
    }
    if (e.code == "ArrowDown" || e.code == "KeyS") {
        keyboard.DOWN = true;
    }
    if (e.code == "Space") {
        keyboard.SPACE = true;
    }
    if (e.code == "KeyR") {
        keyboard.R = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        keyboard.RIGHT = false;
    }
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        keyboard.LEFT = false;
    }
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        keyboard.UP = false;
    }
    if (e.code == "ArrowDown" || e.code == "KeyS") {
        keyboard.DOWN = false;
    }
    if (e.code == "Space") {
        keyboard.SPACE = false;
    }
    if (e.code == "KeyR") {
        keyboard.R = false;
    }
});