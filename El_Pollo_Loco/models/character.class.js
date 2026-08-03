class Character extends MovableObject {

    y = 50;
    height = 300;
    width = 200;
    speed = 10;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    world;
    

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-22.png');
        this.loadImages(this.IMAGES_WALKING);
        this.applyGravity();
        this.animate();
    }

    animate() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed; // Bewegt das Objekt nach rechts
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.x -= this.speed; // Bewegt das Objekt nach links
                this.otherDirection = true;
            }
            this.world.camera_x = -this.x + 100; // Kamera folgt dem Charakter
        }, 2000 / 60); // 60 FPS

        setInterval(() => {

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                // Walk animation
                this.playAnimation(this.IMAGES_WALKING);
            }
        },4000 / 50);
    }


    jump() {

    }
}
