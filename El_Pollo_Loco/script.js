let canvas;
let world;
let keyboard = new Keyboard();
const audioManager = new AudioManager();
const GAME_SOUNDS = {
    MUSIC: "music",
    COIN: "coin",
    JUMP: "jump",
    HURT: "hurt",
    CHICKEN_HURT: "chickenHurt",
    ENDBOSS: "endboss"
};
const GAME_SOUND_CONFIG = [
    [GAME_SOUNDS.MUSIC, "audio/background-music.mp3", { loop: true, volume: 0.2 }],
    [GAME_SOUNDS.COIN, "audio/coin-sound.mp3", { volume: 0.5 }],
    [GAME_SOUNDS.JUMP, "audio/jumping-sound.mp3", { volume: 0.5 }],
    [GAME_SOUNDS.HURT, "audio/pepe-hurt-sound.mp3", { volume: 0.5 }],
    [GAME_SOUNDS.CHICKEN_HURT, "audio/chicken-hurt-sound.mp3", { volume: 0.5 }],
    [GAME_SOUNDS.ENDBOSS, "audio/endboss-chicken-sound.mp3", { volume: 0.4 }]
];
const GAME_KEY_BY_CODE = {
    ArrowRight: "RIGHT",
    KeyD: "RIGHT",
    ArrowLeft: "LEFT",
    KeyA: "LEFT",
    Space: "SPACE",
    KeyR: "R"
};
const SCROLL_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];

initializeGameSounds();

/** Registers every available local audio file. */
function initializeGameSounds() {
    GAME_SOUND_CONFIG.forEach(([name, source, options]) => {
        audioManager.addSound(name, source, options);
    });
}

/** Starts the game once and closes the start screen. */
function startGame() {
    if (world) return;
    keyboard = new Keyboard();
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard, audioManager);
    document.getElementById("start-screen").classList.add("hidden");
    setTouchControlsVisible(true);
    audioManager.play(GAME_SOUNDS.MUSIC);
}

/** Displays the matching result image and end-screen actions. */
function showEndScreen(gameWon) {
    audioManager.stopAll();
    const resultImage = document.getElementById("result-image");
    resultImage.src = gameWon ? "img/You won, you lost/You Won B.png"
        : "img/9_intro_outro_screens/game_over/you lost.png";
    resultImage.alt = gameWon ? "You won" : "You lost";
    document.getElementById("end-screen").classList.remove("hidden");
    setTouchControlsVisible(false);
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
    audioManager.stopAll();
    world = null;
    document.getElementById("end-screen").classList.add("hidden");
    setTouchControlsVisible(false);
}

/** Shows touch controls only while a game is running. */
function setTouchControlsVisible(isVisible) {
    document.querySelector(".touch-controls")
        .classList.toggle("hidden", !isVisible);
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

/** Restores the mute button from the persisted audio state. */
function initializeAudioControls() {
    updateMuteButton();
}

/** Toggles all game audio and refreshes the mute button. */
function toggleMute() {
    audioManager.toggleMute();
    updateMuteButton();
}

/** Displays and describes the current mute state. */
function updateMuteButton() {
    const button = document.getElementById("mute-button");
    const label = audioManager.isMuted ? "Unmute sound" : "Mute sound";
    button.textContent = audioManager.isMuted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
    button.setAttribute("aria-pressed", String(audioManager.isMuted));
    button.setAttribute("aria-label", label);
    button.title = label;
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
window.addEventListener("load", initializeAudioControls);
