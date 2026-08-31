class World {
    character = new Character();
    level = createLevel1();
    canvas;
    context;
    keyboard;
    audioManager;
    cameraX = 0;
    statusBar = new StatusBar();
    coinStatusBar = new CoinStatusBar();
    bottleStatusBar = new BottleStatusBar();
    endbossStatusBar = new EndbossStatusBar();
    throwableObjects = [];
    gameWon = false;
    gameEnding = false;
    isPaused = false;
    runIntervalId;
    animationFrameId;
    endTimeoutId;

    /**
     * Creates and starts a world with input and audio services.
     * @param {HTMLCanvasElement} canvas - Canvas used to render the game.
     * @param {Keyboard} keyboard - Shared keyboard state.
     * @param {AudioManager} audioManager - Shared audio service.
     */
    constructor(canvas, keyboard, audioManager) {
        this.context = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.audioManager = audioManager;
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Gives game objects access to their world.
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => enemy.world = this);
        this.level.clouds.forEach((cloud) => cloud.world = this);
        this.level.coins.forEach((coin) => coin.world = this);
        this.level.bottles.forEach((bottle) => bottle.world = this);
    }

    /**
     * Starts the recurring collision and input checks.
     * @returns {void}
     */
    run() {
        this.runIntervalId = setInterval(() => {
            if (this.gameEnding || this.isPaused) return;
            this.checkCollisions();
            this.checkCollectibles();
            this.checkThrowInput();
            this.checkBottleHits();
            this.removeFinishedBottles();
            this.checkGameEnd();
        }, 1000 / 25);
    }

    /**
     * Plays one named sound through the shared audio manager.
     * @param {string} name - Registered sound name.
     * @returns {void}
     */
    playSound(name) {
        this.audioManager.play(name);
    }

    /**
     * Stops one named sound through the shared audio manager.
     * @param {string} name - Registered sound name.
     * @returns {void}
     */
    stopSound(name) {
        this.audioManager.stop(name);
    }

    /**
     * Creates a throwable bottle when the throw key is pressed.
     * @returns {void}
     */
    checkThrowInput() {
        if (!this.keyboard.R) return;
        if (this.bottleStatusBar.percentage > 0) this.throwBottle();
        this.keyboard.R = false;
    }

    /**
     * Uses one collected bottle and throws it in the facing direction.
     * @returns {void}
     */
    throwBottle() {
        const facingLeft = this.character.otherDirection;
        const x = facingLeft ? this.character.x : this.character.x + 140;
        const bottle = new ThrowableObject(x, this.character.y + 100, facingLeft);
        bottle.world = this;
        this.throwableObjects.push(bottle);
        this.bottleStatusBar.decrease();
    }

    /**
     * Damages the first enemy hit by each flying bottle.
     * @returns {void}
     */
    checkBottleHits() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.isSplashing) return;
            const enemy = this.level.enemies.find((enemy) => {
                return !enemy.isDead() && !enemy.isHurt() && bottle.isColliding(enemy);
            });
            if (!enemy) return;
            enemy.hit();
            this.playBottleHitSounds(enemy);
            this.updateEndbossStatus(enemy);
            bottle.startSplash();
        });
    }

    /**
     * Plays impact and enemy feedback for a bottle hit.
     * @param {MovableObject} enemy - Enemy struck by the bottle.
     * @returns {void}
     */
    playBottleHitSounds(enemy) {
        this.playSound(GAME_SOUNDS.BOTTLE_HIT);
        if (!(enemy instanceof Endboss)) {
            this.playSound(GAME_SOUNDS.CHICKEN_HURT);
        } else if (enemy.isDead()) {
            this.playSound(GAME_SOUNDS.ENDBOSS_DEATH);
        } else {
            this.playSound(GAME_SOUNDS.ENDBOSS);
        }
    }

    /**
     * Updates the boss bar when the hit enemy is the endboss.
     * @param {MovableObject} enemy - Enemy whose status may be displayed.
     * @returns {void}
     */
    updateEndbossStatus(enemy) {
        if (enemy instanceof Endboss) {
            this.endbossStatusBar.setPercentage(enemy.energy);
        }
    }

    /**
     * Starts the end sequence after victory or defeat.
     * @returns {void}
     */
    checkGameEnd() {
        const endboss = this.getEndboss();
        if (this.character.isDead()) return this.prepareGameEnd(false);
        if (endboss && endboss.isDead()) this.prepareGameEnd(true);
    }

    /**
     * Allows the final death animation to play before stopping the game.
     * @param {boolean} gameWon - Whether the pending result is a victory.
     * @returns {void}
     */
    prepareGameEnd(gameWon) {
        this.gameWon = gameWon;
        this.gameEnding = true;
        this.endTimeoutId = setTimeout(() => this.finishGame(), 800);
    }

    /**
     * Freezes or resumes every recurring game task.
     * @param {boolean} isPaused - Whether the world should be paused.
     * @returns {void}
     */
    setPaused(isPaused) {
        this.isPaused = isPaused;
    }

    /**
     * Ends a paused game as a regular defeat.
     * @returns {void}
     */
    giveUp() {
        this.setPaused(false);
        this.character.energy = 0;
        this.statusBar.setPercentage(0);
        this.prepareGameEnd(false);
    }

    /**
     * Stops all activity and opens the matching end screen.
     * @returns {void}
     */
    finishGame() {
        this.stop();
        showEndScreen(this.gameWon);
    }

    /**
     * Returns the level's endboss.
     * @returns {Endboss|undefined} Endboss in the current level, if present.
     */
    getEndboss() {
        return this.level.enemies.find((enemy) => enemy instanceof Endboss);
    }

    /**
     * Removes bottles after their splash animation has finished.
     * @returns {void}
     */
    removeFinishedBottles() {
        this.throwableObjects = this.throwableObjects.filter((bottle) => {
            return !bottle.splashComplete;
        });
    }

    /**
     * Resolves collisions between the character and all living enemies.
     * @returns {void}
     */
    checkCollisions() {
        const collidingEnemies = this.getCollidingEnemies();
        const wasDescending = this.character.speedY < 0;
        const jumpTargets = collidingEnemies.filter((enemy) => {
            return this.isJumpAttack(enemy, wasDescending);
        });
        if (jumpTargets.length > 0) {
            this.defeatEnemiesByJump(jumpTargets);
            return;
        }
        collidingEnemies.forEach((enemy) => this.damageCharacter(enemy));
    }

    /**
     * Returns all living enemies whose hitboxes overlap Pepe.
     * @returns {MovableObject[]} Enemies colliding in the current check.
     */
    getCollidingEnemies() {
        return this.level.enemies.filter((enemy) => {
            return !enemy.isDead() && this.character.isColliding(enemy);
        });
    }

    /**
     * Checks whether Pepe is descending onto a normal chicken from above.
     * @param {MovableObject} enemy - Enemy involved in the collision.
     * @param {boolean} wasDescending - Descent state before collisions change it.
     * @returns {boolean} Whether the collision is a jump attack.
     */
    isJumpAttack(enemy, wasDescending) {
        if (!(enemy instanceof Chicken) || !wasDescending
                || !this.character.isAboveGround()) return false;
        const characterBottom = this.character.y + this.character.height
            - this.character.offset.bottom;
        const enemyTop = enemy.y + enemy.offset.top;
        return characterBottom <= enemyTop + 30;
    }

    /**
     * Defeats all chickens hit from above and applies one upward bounce.
     * @param {Chicken[]} enemies - Chickens defeated in the current check.
     * @returns {void}
     */
    defeatEnemiesByJump(enemies) {
        enemies.forEach((enemy) => enemy.hit());
        this.playSound(GAME_SOUNDS.CHICKEN_HURT);
        this.character.speedY = 15;
    }

    /**
     * Applies enemy-specific contact damage outside a jump attack.
     * @param {MovableObject} enemy - Enemy currently touching Pepe.
     * @returns {void}
     */
    damageCharacter(enemy) {
        if (this.character.isHurt()) return;
        const damage = enemy instanceof Endboss ? 30 : 20;
        this.character.hit(damage);
        this.playSound(GAME_SOUNDS.HURT);
        this.statusBar.setPercentage(this.character.energy);
    }

    /**
     * Removes collected items and updates both collectible status bars.
     * @returns {void}
     */
    checkCollectibles() {
        this.level.coins = this.collectItems(
            this.level.coins, this.coinStatusBar, GAME_SOUNDS.COIN
        );
        this.level.bottles = this.collectItems(
            this.level.bottles, this.bottleStatusBar, null, true
        );
    }

    /**
     * Returns all items that have not collided with the character.
     * @param {MovableObject[]} items - Collectible items to inspect.
     * @param {StatusBar} statusBar - Bar updated after collection.
     * @param {?string} soundName - Sound played after collection.
     * @param {boolean} [hasLimit=false] - Whether a full bar prevents collection.
     * @returns {MovableObject[]} Items that remain in the world.
     */
    collectItems(items, statusBar, soundName, hasLimit = false) {
        return items.filter((item) => {
            if (!this.character.isColliding(item)) return true;
            if (hasLimit && statusBar.percentage >= 100) return true;
            statusBar.increase();
            if (soundName) this.playSound(soundName);
            item.stopIntervals();
            return false;
        });
    }

    /**
     * Draws one frame and schedules the next one.
     * @returns {void}
     */
    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.translate(this.cameraX, 0);
        this.drawWorldObjects();
        this.context.translate(-this.cameraX, 0);
        this.drawStatusBars();
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Stops the world loop and every active game object's intervals.
     * @returns {void}
     */
    stop() {
        clearInterval(this.runIntervalId);
        clearTimeout(this.endTimeoutId);
        cancelAnimationFrame(this.animationFrameId);
        this.getGameObjects().forEach((object) => object.stopIntervals());
    }

    /**
     * Returns all objects which can own recurring game tasks.
     * @returns {MovableObject[]} Active objects owned by this world.
     */
    getGameObjects() {
        return [
            this.character, ...this.level.enemies, ...this.level.clouds,
            ...this.level.coins, ...this.level.bottles, ...this.throwableObjects
        ];
    }

    /**
     * Draws all objects positioned inside the game world.
     * @returns {void}
     */
    drawWorldObjects() {
        this.drawObjects(this.level.backgroundObjects);
        this.drawObjects(this.level.clouds);
        this.drawObjects(this.level.enemies);
        this.drawObjects(this.level.coins);
        this.drawObjects(this.level.bottles);
        this.drawObjects(this.throwableObjects);
        this.drawObject(this.character);
    }

    /**
     * Draws all status bars independently from the camera.
     * @returns {void}
     */
    drawStatusBars() {
        this.drawObject(this.statusBar);
        this.drawObject(this.coinStatusBar);
        this.drawObject(this.bottleStatusBar);
        const endboss = this.getEndboss();
        if (endboss && endboss.isActive) {
            this.drawObject(this.endbossStatusBar);
        }
    }

    /**
     * Draws every object in the provided list.
     * @param {DrawableObject[]} objects - Objects to draw in order.
     * @returns {void}
     */
    drawObjects(objects) {
        objects.forEach((object) => this.drawObject(object));
    }

    /**
     * Draws one object and mirrors it when required.
     * @param {DrawableObject} drawableObject - Object to draw.
     * @returns {void}
     */
    drawObject(drawableObject) {
        if (drawableObject.otherDirection) this.flipImage(drawableObject);
        drawableObject.draw(this.context);
        if (drawableObject.otherDirection) this.flipImageBack(drawableObject);
    }

    /**
     * Mirrors an object's canvas context horizontally.
     * @param {DrawableObject} drawableObject - Object to mirror.
     * @returns {void}
     */
    flipImage(drawableObject) {
        this.context.save();
        this.context.translate(drawableObject.width, 0);
        this.context.scale(-1, 1);
        drawableObject.x *= -1;
    }

    /**
     * Restores an object and the canvas after mirrored drawing.
     * @param {DrawableObject} drawableObject - Mirrored object to restore.
     * @returns {void}
     */
    flipImageBack(drawableObject) {
        this.context.restore();
        drawableObject.x *= -1;
    }
}
