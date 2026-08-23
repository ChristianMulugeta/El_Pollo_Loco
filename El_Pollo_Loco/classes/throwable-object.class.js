const BOTTLE_ROTATION_IMAGES = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
];

const BOTTLE_SPLASH_IMAGES = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
];

class ThrowableObject extends MovableObject {
    horizontalSpeed;
    movementInterval;
    animationInterval;
    isSplashing = false;
    splashComplete = false;

    /** Creates a bottle and launches it in the selected direction. */
    constructor(x, y, facingLeft = false) {
        super();
        this.loadImages(BOTTLE_ROTATION_IMAGES);
        this.loadImages(BOTTLE_SPLASH_IMAGES);
        this.loadImage(BOTTLE_ROTATION_IMAGES[0]);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 50;
        this.horizontalSpeed = facingLeft ? -10 : 10;
        this.throw();
    }

    /** Starts flight movement and rotation. */
    throw() {
        this.speedY = 30;
        this.movementInterval = this.startInterval(() => this.moveThroughAir(), 40);
        this.animationInterval = this.startInterval(() => {
            this.playAnimation(BOTTLE_ROTATION_IMAGES);
        }, 80);
    }

    /** Advances the bottle and starts its splash on the ground. */
    moveThroughAir() {
        this.x += this.horizontalSpeed;
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (this.y >= 360 && this.speedY < 0) this.startSplash();
    }

    /** Stops the flight and switches to the splash animation. */
    startSplash() {
        if (this.isSplashing) return;
        this.isSplashing = true;
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        this.currentImage = 0;
        this.playAnimation(BOTTLE_SPLASH_IMAGES);
        this.animateSplash();
    }

    /** Plays every splash frame once and marks the animation complete. */
    animateSplash() {
        this.animationInterval = this.startInterval(() => {
            if (this.currentImage >= BOTTLE_SPLASH_IMAGES.length) {
                clearInterval(this.animationInterval);
                this.splashComplete = true;
                return;
            }
            this.playAnimation(BOTTLE_SPLASH_IMAGES);
        }, 80);
    }
}
