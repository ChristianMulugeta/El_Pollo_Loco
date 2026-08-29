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

    /** Creates a chicken with configurable images, size, and speed. */
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
        this.x = 200 + Math.random() * 1800;
        this.speed = minSpeed + Math.random() * speedRange;
        this.energy = 5;
        this.animate();
    }

    /** Starts movement and state-dependent animation intervals. */
    animate() {
        this.startInterval(() => this.updateMovement(), 1000 / 60);
        this.startInterval(() => this.updateAnimation(), 1000 / 8);
    }

    /** Moves only living and currently unharmed chickens. */
    updateMovement() {
        if (!this.isDead() && !this.isHurt()) this.moveLeft();
    }

    /** Displays the walking or dead state. */
    updateAnimation() {
        if (this.isDead()) {
            this.playAnimation([this.deadImage]);
        } else if (!this.isHurt()) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }
}
