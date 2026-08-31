const CHICKEN_WALKING_IMAGES = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
];
const CHICKEN_DEAD_IMAGE =
    'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

class Chicken extends MovableObject {
    offset = {
        top: 5,
        right: 2,
        bottom: 7,
        left: 2
    };
    IMAGES_WALKING;
    deadImage;

    /**
     * Creates a chicken with configurable images, size, and speed.
     * @param {string[]} [images=CHICKEN_WALKING_IMAGES] - Walking frames.
     * @param {number} [size=70] - Width and height in canvas pixels.
     * @param {number} [minSpeed=0.15] - Minimum movement speed.
     * @param {number} [speedRange=0.5] - Random additional speed range.
     * @param {string} [deadImage=CHICKEN_DEAD_IMAGE] - Dead-state image.
     */
    constructor(images = CHICKEN_WALKING_IMAGES, size = 70,
            minSpeed = 0.15, speedRange = 0.5,
            deadImage = CHICKEN_DEAD_IMAGE) {
        super();
        this.IMAGES_WALKING = images;
        this.deadImage = deadImage;
        this.loadImages([...images, deadImage]);
        this.loadImage(images[0]);
        this.height = size;
        this.width = size;
        this.y = 420 - size;
        this.x = 500 + Math.random() * 1500;
        this.speed = minSpeed + Math.random() * speedRange;
        this.energy = 5;
        this.animate();
    }

    /**
     * Starts movement and state-dependent animation intervals.
     * @returns {void}
     */
    animate() {
        this.startInterval(() => this.updateMovement(), 1000 / 60);
        this.startInterval(() => this.updateAnimation(), 1000 / 8);
    }

    /**
     * Moves only living and currently unharmed chickens.
     * @returns {void}
     */
    updateMovement() {
        if (!this.isDead() && !this.isHurt()) this.moveLeft();
    }

    /**
     * Displays the walking or dead state.
     * @returns {void}
     */
    updateAnimation() {
        if (this.isDead()) {
            this.playAnimation([this.deadImage]);
        } else if (!this.isHurt()) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }
}
