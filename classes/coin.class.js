class Coin extends MovableObject {
    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates an animated coin at the given position.
     * @param {number} x - Horizontal world position.
     * @param {number} y - Vertical world position.
     */
    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES);
        this.loadImage(this.IMAGES[0]);
        this.x = x;
        this.y = y;
        this.width = 120;
        this.height = 120;
        this.offset = { top: 38, right: 38, bottom: 38, left: 38 };
        this.animate();
    }

    /**
     * Alternates between the available coin images.
     * @returns {void}
     */
    animate() {
        this.startInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 200);
    }
}
