let canvas;
let world;
let keyboard = new Keyboard();


/** Starts the game once and closes the start screen. */
function startGame() {
    if (world) return;
    keyboard = new Keyboard();
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    document.getElementById("start-screen").classList.add("hidden");
}

/** Displays the matching result image and end-screen actions. */
function showEndScreen(gameWon) {
    const resultImage = document.getElementById("result-image");
    resultImage.src = gameWon ? "img/You won, you lost/You Won B.png"
        : "img/9_intro_outro_screens/game_over/you lost.png";
    resultImage.alt = gameWon ? "You won" : "You lost";
    document.getElementById("end-screen").classList.remove("hidden");
}

/** Starts a fresh world without reloading the page. */
function restartGame() {
    resetGameView();
    startGame();
}

/** Returns to the start screen without reloading the page. */
function returnHome() {
    resetGameView();
    clearCanvas();
    document.getElementById("start-screen").classList.remove("hidden");
}

/** Removes the finished world and hides its result screen. */
function resetGameView() {
    if (world) world.stop();
    world = null;
    document.getElementById("end-screen").classList.add("hidden");
}

/** Clears the last rendered game frame. */
function clearCanvas() {
    if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

/** Opens the controls dialog. */
function showControls() {
    document.getElementById("controls-dialog").showModal();
}

/** Closes the controls dialog. */
function closeControls() {
    document.getElementById("controls-dialog").close();
}

/** Closes the dialog when its backdrop is clicked. */
function closeControlsOnBackdrop(event) {
    const dialog = event.currentTarget;
    const rect = dialog.getBoundingClientRect();
    const outsideX = event.clientX < rect.left || event.clientX > rect.right;
    const outsideY = event.clientY < rect.top || event.clientY > rect.bottom;
    if (outsideX || outsideY) closeControls();
}

window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
    }
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
    if (e.code == "KeyR" && !e.repeat) {
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
});
