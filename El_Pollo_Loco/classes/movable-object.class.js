class MovableObject extends DrawableObject {

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    intervalIds = [];
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    /** Applies vertical acceleration while the object is airborne. */
    applyGravity() {
        this.startInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /** Starts and stores an interval so it can be stopped with the game. */
    startInterval(callback, delay) {
        const intervalId = setInterval(callback, delay);
        this.intervalIds.push(intervalId);
        return intervalId;
    }

    /** Stops every recurring task owned by this object. */
    stopIntervals() {
        this.intervalIds.forEach((intervalId) => clearInterval(intervalId));
        this.intervalIds = [];
    }

    /** Checks whether this object should continue falling. */
    isAboveGround() {
        return this instanceof ThrowableObject || this.y < 120;
    }

    /** Checks whether the visible hitboxes of two objects overlap. */
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

    /** Reduces energy and records when a surviving object was hit. */
    hit(damage = 5) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = Date.now();
        }
    }

    /** Checks whether the latest hit is still inside the hurt cooldown. */
    isHurt() {
        const secondsSinceHit = (Date.now() - this.lastHit) / 1000;
        return secondsSinceHit < 1;
    }

    /** Checks whether the object has no energy left. */
    isDead() {
        return this.energy === 0;
    }

    /** Moves the object right by its current speed. */
    moveRight() {
        this.x += this.speed;
    }

    /** Moves the object left by its current speed. */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Displays the next image of a looping animation. */
    playAnimation(images) {
        const imageIndex = this.currentImage % images.length;
        const imagePath = images[imageIndex];
        this.img = this.imageCache[imagePath];
        this.currentImage++;
    }
}
