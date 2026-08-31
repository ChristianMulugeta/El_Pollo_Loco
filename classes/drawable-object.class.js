class DrawableObject {

    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 250;
    height = 150;
    width = 100;

    /**
     * Loads one image and assigns it to the drawable object.
     * @param {string} imagePath - Relative path of the image to load.
     * @returns {void}
     */
    loadImage(imagePath) {
        this.img = new Image();
        this.img.src = imagePath;
    }

    /**
     * Draws the object at its current position and size.
     * @param {CanvasRenderingContext2D} context - Canvas context to draw on.
     * @returns {void}
     */
    draw(context) {
        context.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Preloads multiple images for later animation playback.
     * @param {string[]} imagePaths - Relative paths of the images to preload.
     * @returns {void}
     */
    loadImages(imagePaths) {
        imagePaths.forEach((imagePath) => {
            const image = new Image();
            image.src = imagePath;
            this.imageCache[imagePath] = image;
        });
    }
}
