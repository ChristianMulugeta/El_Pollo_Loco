class BackgroundObject extends MovableObject {
    
    width = 720;
    height = 480;

    /** Creates one background layer at the given horizontal position. */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}
