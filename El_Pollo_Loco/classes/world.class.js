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
    runIntervalId;
    animationFrameId;
    endTimeoutId;

    /** Creates and starts a world with input and audio services. */
    constructor(canvas, keyboard, audioManager) {
        this.context = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.audioManager = audioManager;
        this.draw();
        this.setWorld();
        this.run();
    }

    /** Gives game objects access to their world. */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => enemy.world = this);
    }

    /** Starts the recurring collision and input checks. */
    run() {
        this.runIntervalId = setInterval(() => {
            if (this.gameEnding) return;
            this.checkCollisions();
            this.checkCollectibles();
            this.checkThrowInput();
            this.checkBottleHits();
            this.removeFinishedBottles();
            this.checkGameEnd();
        }, 1000 / 25);
    }

    /** Plays one named sound through the shared audio manager. */
    playSound(name) {
        this.audioManager.play(name);
    }

    /** Creates a throwable bottle when the throw key is pressed. */
    checkThrowInput() {
        if (!this.keyboard.R) return;
        if (this.bottleStatusBar.percentage > 0) this.throwBottle();
        this.keyboard.R = false;
    }

    /** Uses one collected bottle and throws it in the facing direction. */
    throwBottle() {
        const facingLeft = this.character.otherDirection;
        const x = facingLeft ? this.character.x : this.character.x + 140;
        const bottle = new ThrowableObject(x, this.character.y + 100, facingLeft);
        this.throwableObjects.push(bottle);
        this.bottleStatusBar.decrease();
    }

    /** Damages the first enemy hit by each flying bottle. */
    checkBottleHits() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.isSplashing) return;
            const enemy = this.level.enemies.find((enemy) => {
                return !enemy.isDead() && !enemy.isHurt() && bottle.isColliding(enemy);
            });
            if (!enemy) return;
            enemy.hit();
            this.updateEndbossStatus(enemy);
            bottle.startSplash();
        });
    }

    /** Updates the boss bar when the hit enemy is the endboss. */
    updateEndbossStatus(enemy) {
        if (enemy instanceof Endboss) {
            this.endbossStatusBar.setPercentage(enemy.energy);
        }
    }

    /** Starts the end sequence after victory or defeat. */
    checkGameEnd() {
        const endboss = this.getEndboss();
        if (this.character.isDead()) return this.prepareGameEnd(false);
        if (endboss && endboss.isDead()) this.prepareGameEnd(true);
    }

    /** Allows the final death animation to play before stopping the game. */
    prepareGameEnd(gameWon) {
        this.gameWon = gameWon;
        this.gameEnding = true;
        this.endTimeoutId = setTimeout(() => this.finishGame(), 800);
    }

    /** Stops all activity and opens the matching end screen. */
    finishGame() {
        this.stop();
        showEndScreen(this.gameWon);
    }

    /** Returns the level's endboss. */
    getEndboss() {
        return this.level.enemies.find((enemy) => enemy instanceof Endboss);
    }

    /** Removes bottles after their splash animation has finished. */
    removeFinishedBottles() {
        this.throwableObjects = this.throwableObjects.filter((bottle) => {
            return !bottle.splashComplete;
        });
    }

    /** Resolves collisions between the character and all living enemies. */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            this.handleEnemyCollision(enemy);
        });
    }

    /** Chooses between a jump attack and character damage. */
    handleEnemyCollision(enemy) {
        if (enemy.isDead() || !this.character.isColliding(enemy)) return;
        if (this.isJumpAttack(enemy)) {
            this.defeatEnemyByJump(enemy);
            return;
        }
        this.damageCharacter();
    }

    /** Checks whether Pepe is descending onto a normal chicken from above. */
    isJumpAttack(enemy) {
        if (!(enemy instanceof Chicken) || !this.character.isAboveGround()) return false;
        const characterBottom = this.character.y + this.character.height
            - this.character.offset.bottom;
        const enemyTop = enemy.y + enemy.offset.top;
        return this.character.speedY < 0 && characterBottom <= enemyTop + 30;
    }

    /** Defeats a chicken and gives Pepe a small upward bounce. */
    defeatEnemyByJump(enemy) {
        enemy.hit();
        this.playSound(GAME_SOUNDS.CHICKEN_HURT);
        this.character.speedY = 15;
    }

    /** Applies contact damage when the collision is not a jump attack. */
    damageCharacter() {
        if (this.character.isHurt()) return;
        this.character.hit();
        this.playSound(GAME_SOUNDS.HURT);
        this.statusBar.setPercentage(this.character.energy);
    }

    /** Removes collected items and updates both collectible status bars. */
    checkCollectibles() {
        this.level.coins = this.collectItems(
            this.level.coins, this.coinStatusBar, GAME_SOUNDS.COIN
        );
        this.level.bottles = this.collectItems(this.level.bottles, this.bottleStatusBar);
    }

    /** Returns all items that have not collided with the character. */
    collectItems(items, statusBar, soundName) {
        return items.filter((item) => {
            if (!this.character.isColliding(item)) return true;
            statusBar.increase();
            if (soundName) this.playSound(soundName);
            item.stopIntervals();
            return false;
        });
    }

    /** Draws one frame and schedules the next one. */
    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.translate(this.cameraX, 0);
        this.drawWorldObjects();
        this.context.translate(-this.cameraX, 0);
        this.drawStatusBars();
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /** Stops the world loop and every active game object's intervals. */
    stop() {
        clearInterval(this.runIntervalId);
        clearTimeout(this.endTimeoutId);
        cancelAnimationFrame(this.animationFrameId);
        this.getGameObjects().forEach((object) => object.stopIntervals());
    }

    /** Returns all objects which can own recurring game tasks. */
    getGameObjects() {
        return [
            this.character, ...this.level.enemies, ...this.level.clouds,
            ...this.level.coins, ...this.level.bottles, ...this.throwableObjects
        ];
    }

    /** Draws all objects positioned inside the game world. */
    drawWorldObjects() {
        this.drawObjects(this.level.backgroundObjects);
        this.drawObject(this.character);
        this.drawObjects(this.level.clouds);
        this.drawObjects(this.level.enemies);
        this.drawObjects(this.level.coins);
        this.drawObjects(this.level.bottles);
        this.drawObjects(this.throwableObjects);
    }

    /** Draws all status bars independently from the camera. */
    drawStatusBars() {
        this.drawObject(this.statusBar);
        this.drawObject(this.coinStatusBar);
        this.drawObject(this.bottleStatusBar);
        const endboss = this.getEndboss();
        if (endboss && endboss.isActive) {
            this.drawObject(this.endbossStatusBar);
        }
    }

    /** Draws every object in the provided list. */
    drawObjects(objects) {
        objects.forEach((object) => this.drawObject(object));
    }

    /** Draws one object and mirrors it when required. */
    drawObject(drawableObject) {
        if (drawableObject.otherDirection) this.flipImage(drawableObject);
        drawableObject.draw(this.context);
        if (drawableObject.otherDirection) this.flipImageBack(drawableObject);
    }

    /** Mirrors an object's canvas context horizontally. */
    flipImage(drawableObject) {
        this.context.save();
        this.context.translate(drawableObject.width, 0);
        this.context.scale(-1, 1);
        drawableObject.x *= -1;
    }

    /** Restores an object and the canvas after mirrored drawing. */
    flipImageBack(drawableObject) {
        this.context.restore();
        drawableObject.x *= -1;
    }
}
