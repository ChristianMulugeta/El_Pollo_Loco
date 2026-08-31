let canvas;
let world;
let keyboard = new Keyboard();
const audioManager = new AudioManager();
const GAME_SOUNDS = {
    MUSIC: "music",
    COIN: "coin",
    JUMP: "jump",
    HURT: "hurt",
    SNORE: "snore",
    BOTTLE_HIT: "bottleHit",
    CHICKEN_HURT: "chickenHurt",
    ENDBOSS: "endboss",
    ENDBOSS_DEATH: "endbossDeath",
    YOU_WON: "youWon",
    YOU_LOST: "youLost"
};
const GAME_SOUND_CONFIG = [
    [GAME_SOUNDS.MUSIC, "audio/background-music.mp3", { loop: true, volume: 0.2 }],
    [GAME_SOUNDS.COIN, "audio/coin-sound.mp3", { volume: 0.5 }],
    [GAME_SOUNDS.JUMP, "audio/jumping-sound.mp3", { volume: 0.5 }],
    [GAME_SOUNDS.HURT, "audio/pepe-hurt-sound.mp3", { volume: 0.5 }],
    [GAME_SOUNDS.SNORE, "audio/pepe-snoring.mp3", { loop: true, volume: 0.45 }],
    [GAME_SOUNDS.BOTTLE_HIT, "audio/salsa-bottle-hit.mp3", { volume: 0.5 }],
    [GAME_SOUNDS.CHICKEN_HURT, "audio/chicken-hurt-sound.mp3", { volume: 0.5 }],
    [GAME_SOUNDS.ENDBOSS, "audio/endboss-chicken-sound.mp3", { volume: 0.4 }],
    [GAME_SOUNDS.ENDBOSS_DEATH, "audio/endboss-death.mp3", { volume: 0.55 }],
    [GAME_SOUNDS.YOU_WON, "audio/you-won-sound.mp3", { volume: 0.6 }],
    [GAME_SOUNDS.YOU_LOST, "audio/you-lost-sound.mp3", { volume: 0.6 }]
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

/**
 * Registers every available local audio file.
 * @returns {void}
 */
function initializeGameSounds() {
    GAME_SOUND_CONFIG.forEach(([name, source, options]) => {
        audioManager.addSound(name, source, options);
    });
}

/**
 * Starts the game once and closes the start screen.
 * @returns {void}
 */
function startGame() {
    if (world) return;
    keyboard = new Keyboard();
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard, audioManager);
    document.getElementById("start-screen").classList.add("hidden");
    setSettingsVisible(true);
    setTouchControlsVisible(true);
    audioManager.play(GAME_SOUNDS.MUSIC);
}

/**
 * Displays the matching result image and end-screen actions.
 * @param {boolean} gameWon - Whether the player won the game.
 * @returns {void}
 */
function showEndScreen(gameWon) {
    audioManager.stopAll();
    audioManager.play(gameWon ? GAME_SOUNDS.YOU_WON : GAME_SOUNDS.YOU_LOST);
    const resultImage = document.getElementById("result-image");
    resultImage.src = gameWon ? "img/You won, you lost/You Won B.png"
        : "img/9_intro_outro_screens/game_over/you lost.png";
    resultImage.alt = gameWon ? "You won" : "You lost";
    document.getElementById("end-screen").classList.remove("hidden");
    closePauseMenu();
    setSettingsVisible(false);
    setTouchControlsVisible(false);
}

/**
 * Starts a fresh world without reloading the page.
 * @returns {void}
 */
function restartGame() {
    resetGameView();
    startGame();
}

/**
 * Returns to the start screen without reloading the page.
 * @returns {void}
 */
function returnHome() {
    resetGameView();
    clearCanvas();
    document.getElementById("start-screen").classList.remove("hidden");
}

/**
 * Removes the finished world and hides its result screen.
 * @returns {void}
 */
function resetGameView() {
    if (world) world.stop();
    audioManager.stopAll();
    world = null;
    closePauseMenu();
    setSettingsVisible(false);
    document.getElementById("end-screen").classList.add("hidden");
    setTouchControlsVisible(false);
}

/**
 * Shows the settings button only while a game is active.
 * @param {boolean} isVisible - Whether the settings button should be visible.
 * @returns {void}
 */
function setSettingsVisible(isVisible) {
    document.getElementById("settings-button").classList.toggle("hidden", !isVisible);
}

/**
 * Pauses the game and opens its settings overlay.
 * @returns {void}
 */
function pauseGame() {
    if (!world || world.gameEnding) return;
    world.setPaused(true);
    releaseGameKeys();
    audioManager.pauseAll();
    document.getElementById("pause-screen").classList.remove("hidden");
}

/**
 * Closes the settings overlay and continues the game.
 * @returns {void}
 */
function resumeGame() {
    if (!world) return;
    releaseGameKeys();
    world.setPaused(false);
    keyboard.recordInput();
    closePauseMenu();
    audioManager.resume(GAME_SOUNDS.MUSIC);
    if (world.character.isSnoring) audioManager.resume(GAME_SOUNDS.SNORE);
}

/**
 * Hides all parts of the pause overlay.
 * @returns {void}
 */
function closePauseMenu() {
    document.getElementById("pause-screen").classList.add("hidden");
}

/**
 * Releases held controls so movement cannot stick after pausing.
 * @returns {void}
 */
function releaseGameKeys() {
    Object.keys(GAME_KEY_BY_CODE).forEach((code) => {
        keyboard[GAME_KEY_BY_CODE[code]] = false;
    });
}

/**
 * Leaves the pause menu and starts the defeat sequence.
 * @returns {void}
 */
function giveUpGame() {
    if (!world) return;
    closePauseMenu();
    audioManager.resume(GAME_SOUNDS.MUSIC);
    world.giveUp();
}

/**
 * Shows touch controls only while a game is running.
 * @param {boolean} isVisible - Whether the touch controls should be visible.
 * @returns {void}
 */
function setTouchControlsVisible(isVisible) {
    document.querySelector(".touch-controls")
        .classList.toggle("hidden", !isVisible);
}

/**
 * Clears the last rendered game frame.
 * @returns {void}
 */
function clearCanvas() {
    if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Connects every marked touch button to its keyboard state.
 * @returns {void}
 */
function initializeTouchControls() {
    document.querySelectorAll("[data-key]").forEach(bindTouchButton);
    const controls = document.querySelector(".touch-controls");
    controls.addEventListener("contextmenu", (event) => event.preventDefault());
}

/**
 * Adds press and release handling to one touch button.
 * @param {HTMLButtonElement} button - Touch button to connect.
 * @returns {void}
 */
function bindTouchButton(button) {
    button.addEventListener("pointerdown", (event) => updateTouchKey(event, true));
    ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
        button.addEventListener(eventName, (event) => updateTouchKey(event, false));
    });
}

/**
 * Updates the keyboard property selected by the pressed button.
 * @param {PointerEvent} event - Pointer interaction on a touch button.
 * @param {boolean} isPressed - Whether the button is currently pressed.
 * @returns {void}
 */
function updateTouchKey(event, isPressed) {
    event.preventDefault();
    keyboard[event.currentTarget.dataset.key] = isPressed;
    keyboard.recordInput();
}

/**
 * Restores the mute button from the persisted audio state.
 * @returns {void}
 */
function initializeAudioControls() {
    updateMuteButton();
}

/**
 * Toggles all game audio and refreshes the mute button.
 * @returns {void}
 */
function toggleMute() {
    audioManager.toggleMute();
    updateMuteButton();
}

/**
 * Displays and describes the current mute state.
 * @returns {void}
 */
function updateMuteButton() {
    const button = document.getElementById("mute-button");
    const label = audioManager.isMuted ? "Unmute sound" : "Mute sound";
    button.textContent = audioManager.isMuted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
    button.setAttribute("aria-pressed", String(audioManager.isMuted));
    button.setAttribute("aria-label", label);
    button.title = label;
}

/**
 * Opens the controls dialog.
 * @returns {void}
 */
function showControls() {
    document.getElementById("controls-dialog").showModal();
}

/**
 * Closes the controls dialog.
 * @returns {void}
 */
function closeControls() {
    document.getElementById("controls-dialog").close();
}

/**
 * Closes the dialog when its backdrop is clicked.
 * @param {MouseEvent} event - Click dispatched by the controls dialog.
 * @returns {void}
 */
function closeControlsOnBackdrop(event) {
    if (isBackdropClick(event)) closeControls();
}

/**
 * Opens the legal notice dialog.
 * @returns {void}
 */
function showLegalNotice() {
    document.getElementById("legal-dialog").showModal();
}

/**
 * Closes the legal notice dialog.
 * @returns {void}
 */
function closeLegalNotice() {
    document.getElementById("legal-dialog").close();
}

/**
 * Closes the legal notice when its backdrop is clicked.
 * @param {MouseEvent} event - Click dispatched by the legal dialog.
 * @returns {void}
 */
function closeLegalNoticeOnBackdrop(event) {
    if (isBackdropClick(event)) closeLegalNotice();
}

/**
 * Checks whether a dialog click occurred outside its visible box.
 * @param {MouseEvent} event - Click dispatched by a dialog element.
 * @returns {boolean} Whether the click occurred on the backdrop.
 */
function isBackdropClick(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const outsideX = event.clientX < rect.left || event.clientX > rect.right;
    const outsideY = event.clientY < rect.top || event.clientY > rect.bottom;
    return outsideX || outsideY;
}

/**
 * Prevents page scrolling and activates the matching game control.
 * @param {KeyboardEvent} event - Keydown event to process.
 * @returns {void}
 */
function handleKeyDown(event) {
    if (SCROLL_KEYS.includes(event.code)) event.preventDefault();
    updateKeyboardState(event, true);
}

/**
 * Releases the game control assigned to the keyboard event.
 * @param {KeyboardEvent} event - Keyup event to process.
 * @returns {void}
 */
function handleKeyUp(event) {
    updateKeyboardState(event, false);
}

/**
 * Maps a browser key code to one property of the shared keyboard state.
 * @param {KeyboardEvent} event - Keyboard event to map.
 * @param {boolean} isPressed - Whether the mapped control is pressed.
 * @returns {void}
 */
function updateKeyboardState(event, isPressed) {
    const gameKey = GAME_KEY_BY_CODE[event.code];
    if (!gameKey || event.repeat) return;
    keyboard[gameKey] = isPressed;
    keyboard.recordInput();
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

window.addEventListener("load", initializeTouchControls);
window.addEventListener("load", initializeAudioControls);
