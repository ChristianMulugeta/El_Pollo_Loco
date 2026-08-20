class Bottle extends MovableObject {
    IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /** Creates an animated collectible bottle at the given position. */
    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES);
        this.loadImage(this.IMAGES[0]);
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.offset = { top: 15, right: 17, bottom: 8, left: 34 };
        this.animate();
    }

    /** Alternates between the available bottle images. */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 250);
    }
}
