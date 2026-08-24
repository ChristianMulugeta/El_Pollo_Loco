let canvas;
let world;
let keyboard = new Keyboard();
const GAME_KEY_BY_CODE = {
    ArrowRight: "RIGHT",
    KeyD: "RIGHT",
    ArrowLeft: "LEFT",
    KeyA: "LEFT",
    Space: "SPACE",
    KeyR: "R"
};
const SCROLL_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];


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

/** Connects every marked touch button to its keyboard state. */
function initializeTouchControls() {
    document.querySelectorAll("[data-key]").forEach(bindTouchButton);
    const controls = document.querySelector(".touch-controls");
    controls.addEventListener("contextmenu", (event) => event.preventDefault());
}

/** Adds press and release handling to one touch button. */
function bindTouchButton(button) {
    button.addEventListener("pointerdown", (event) => updateTouchKey(event, true));
    ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
        button.addEventListener(eventName, (event) => updateTouchKey(event, false));
    });
}

/** Updates the keyboard property selected by the pressed button. */
function updateTouchKey(event, isPressed) {
    event.preventDefault();
    keyboard[event.currentTarget.dataset.key] = isPressed;
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

/** Prevents page scrolling and activates the matching game control. */
function handleKeyDown(event) {
    if (SCROLL_KEYS.includes(event.code)) event.preventDefault();
    updateKeyboardState(event, true);
}

/** Releases the game control assigned to the keyboard event. */
function handleKeyUp(event) {
    updateKeyboardState(event, false);
}

/** Maps a browser key code to one property of the shared keyboard state. */
function updateKeyboardState(event, isPressed) {
    const gameKey = GAME_KEY_BY_CODE[event.code];
    if (!gameKey || event.repeat) return;
    keyboard[gameKey] = isPressed;
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

window.addEventListener("load", initializeTouchControls);
