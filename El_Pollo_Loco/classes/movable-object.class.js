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

    isAboveGround() {
        if (this instanceof ThrowableObject) { // ThrowableObjectsObjects should always fall
            return true;
        } else {
            return this.y < 120;
        }
    }

    // character.isColliding(chicken) => true / false
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    hit(damage = 5) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        }else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Differenz in ms
        timepassed = timepassed / 1000; // Differenz in s
        return timepassed < 1;
    }

    isDead() {
        return this.energy == 0;
    }

    moveRight() {
        this.x += this.speed; // Bewegt das Objekt nach rechts
    }

    moveLeft() {
            this.x -= this.speed; // Bewegt das Objekt nach links
    }

    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

}
