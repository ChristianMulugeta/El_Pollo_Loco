const CHICKEN_WALKING_IMAGES = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
];

class Chicken extends MovableObject {
    offset = {
        top: 5,
        right: 2,
        bottom: 7,
        left: 2
    };
    IMAGES_WALKING;

    /** Creates a chicken with configurable images, size, and speed. */
    constructor(images = CHICKEN_WALKING_IMAGES, size = 70,
            minSpeed = 0.15, speedRange = 0.5) {
        super();
        this.IMAGES_WALKING = images;
        this.loadImages(images);
        this.loadImage(images[0]);
        this.height = size;
        this.width = size;
        this.y = 420 - size;
        this.x = 200 + Math.random() * 1800;
        this.speed = minSpeed + Math.random() * speedRange;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60); // 60 FPS
        
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000 / 8); // 8 FPS
    }
}
