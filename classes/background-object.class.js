class BackgroundObject extends MovableObject {
    
    width = 720;
    height = 480;

    /**
     * Creates one background layer at the given horizontal position.
     * @param {string} imagePath - Relative path of the layer image.
     * @param {number} x - Horizontal world position.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}
