class MovableObject extends DrawableObject {

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    groundY = 120;
    energy = 100;
    lastHit = 0;
    intervalIds = [];
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    /**
     * Applies vertical acceleration while the object is airborne.
     * @returns {void}
     */
    applyGravity() {
        this.startInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                this.stopAtGround();
            }
        }, 1000 / 25);
    }

    /**
     * Places a falling object exactly on its ground position.
     * @returns {void}
     */
    stopAtGround() {
        if (this instanceof ThrowableObject || this.y < this.groundY) return;
        this.y = this.groundY;
        this.speedY = 0;
    }

    /**
     * Starts and stores an interval so it can be stopped with the game.
     * @param {Function} callback - Task to execute on every interval tick.
     * @param {number} delay - Delay between executions in milliseconds.
     * @returns {number} Identifier of the created interval.
     */
    startInterval(callback, delay) {
        const intervalId = setInterval(() => {
            if (!this.world?.isPaused) callback();
        }, delay);
        this.intervalIds.push(intervalId);
        return intervalId;
    }

    /**
     * Stops every recurring task owned by this object.
     * @returns {void}
     */
    stopIntervals() {
        this.intervalIds.forEach((intervalId) => clearInterval(intervalId));
        this.intervalIds = [];
    }

    /**
     * Checks whether this object should continue falling.
     * @returns {boolean} Whether the object is above its ground position.
     */
    isAboveGround() {
        return this instanceof ThrowableObject || this.y < this.groundY;
    }

    /**
     * Checks whether the visible hitboxes of two objects overlap.
     * @param {MovableObject} movableObject - Other object to test against.
     * @returns {boolean} Whether both hitboxes overlap.
     */
    isColliding(movableObject) {
        return this.x + this.width - this.offset.right
                > movableObject.x + movableObject.offset.left
            && this.y + this.height - this.offset.bottom
                > movableObject.y + movableObject.offset.top
            && this.x + this.offset.left
                < movableObject.x + movableObject.width - movableObject.offset.right
            && this.y + this.offset.top
                < movableObject.y + movableObject.height - movableObject.offset.bottom;
    }

    /**
     * Reduces energy and records when a surviving object was hit.
     * @param {number} [damage=5] - Amount of energy to remove.
     * @returns {void}
     */
    hit(damage = 5) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = Date.now();
        }
    }

    /**
     * Checks whether the latest hit is still inside the hurt cooldown.
     * @returns {boolean} Whether the object is currently hurt.
     */
    isHurt() {
        const secondsSinceHit = (Date.now() - this.lastHit) / 1000;
        return secondsSinceHit < 1;
    }

    /**
     * Checks whether the object has no energy left.
     * @returns {boolean} Whether the object is dead.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Moves the object right by its current speed.
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object left by its current speed.
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Displays the next image of a looping animation.
     * @param {string[]} images - Ordered animation image paths.
     * @returns {void}
     */
    playAnimation(images) {
        const imageIndex = this.currentImage % images.length;
        const imagePath = images[imageIndex];
        this.img = this.imageCache[imagePath];
        this.currentImage++;
    }
}
