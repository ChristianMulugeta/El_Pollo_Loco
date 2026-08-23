class World {
    character = new Character();
    level = createLevel1();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    coinStatusBar = new CoinStatusBar();
    bottleStatusBar = new BottleStatusBar();
    endbossStatusBar = new EndbossStatusBar();
    throwableObjects = [];
    gameWon = false;

    /** Creates and starts a world for the given canvas and keyboard. */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
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
        setInterval(() => {
            this.checkCollisions();
            this.checkCollectibles();
            this.checkThrowObjects();
            this.checkBottleHits();
            this.removeFinishedBottles();
            this.checkWinCondition();
        }, 1000 / 25);
    }

    /** Creates a throwable bottle when the throw key is pressed. */
    checkThrowObjects() {
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

    /** Stores the win condition after the endboss has died. */
    checkWinCondition() {
        const endboss = this.getEndboss();
        if (endboss && endboss.isDead()) this.gameWon = true;
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
        this.character.speedY = 15;
    }

    /** Applies contact damage when the collision is not a jump attack. */
    damageCharacter() {
        if (this.character.isHurt()) return;
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
    }

    /** Removes collected items and updates both collectible status bars. */
    checkCollectibles() {
        this.level.coins = this.collectItems(this.level.coins, this.coinStatusBar);
        this.level.bottles = this.collectItems(this.level.bottles, this.bottleStatusBar);
    }

    /** Returns all items that have not collided with the character. */
    collectItems(items, statusBar) {
        return items.filter((item) => {
            if (!this.character.isColliding(item)) return true;
            statusBar.increase();
            return false;
        });
    }

    /** Draws one frame and schedules the next one. */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawStatusBars();
        requestAnimationFrame(() => this.draw());
    }

    /** Draws all objects positioned inside the game world. */
    drawWorldObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
    }

    /** Draws all status bars independently from the camera. */
    drawStatusBars() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        const endboss = this.getEndboss();
        if (endboss && endboss.isActive) {
            this.addToMap(this.endbossStatusBar);
        }
    }

    /** Draws every object in the provided list. */
    addObjectsToMap(objects) {
        objects.forEach((object) => this.addToMap(object));
    }

    /** Draws one object and mirrors it when required. */
    addToMap(movableObject) {
        if (movableObject.otherDirection) this.flipImage(movableObject);
        movableObject.draw(this.ctx);
        if (movableObject.otherDirection) this.flipImageBack(movableObject);
    }

    /** Mirrors an object's canvas context horizontally. */
    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x *= -1;
    }

    /** Restores an object and the canvas after mirrored drawing. */
    flipImageBack(movableObject) {
        this.ctx.restore();
        movableObject.x *= -1;
    }
}
