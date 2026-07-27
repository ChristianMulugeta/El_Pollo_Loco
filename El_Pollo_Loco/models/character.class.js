class Character extends MovableObject {

    y = 130;
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
        this.animate();
    }

    animate() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT) {
                this.x += this.speed; // Bewegt das Objekt nach rechts
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT) {
                this.x -= this.speed; // Bewegt das Objekt nach links
                this.otherDirection = true;
            }
        }, 1000 / 60); // 60 FPS

        setInterval(() => {

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.x += this.speed; // Bewegt das Objekt nach rechts

                // Walk animation
                let index = this.currentImage % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[index];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 1000 / 10); // 8 FPS
    }


    jump() {

    }
}