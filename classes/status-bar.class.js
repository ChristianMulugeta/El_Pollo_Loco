const HEALTH_STATUS_IMAGES = [
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
];

class StatusBar extends DrawableObject {
    percentage;

    /**
     * Creates a status bar with configurable images and position.
     * @param {string[]} [images=HEALTH_STATUS_IMAGES] - Status images.
     * @param {number} [y=0] - Vertical canvas position.
     * @param {number} [percentage=100] - Initial percentage value.
     */
    constructor(images = HEALTH_STATUS_IMAGES, y = 0, percentage = 100) {
        super();
        this.IMAGES = images;
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.setPercentage(percentage);
    }

    /**
     * Updates the percentage and displayed status image.
     * @param {number} percentage - New percentage value.
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(percentage, 100));
        const imagePath = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[imagePath];
    }

    /**
     * Raises a collectible status bar by one of five steps.
     * @returns {void}
     */
    increase() {
        this.setPercentage(this.percentage + 20);
    }

    /**
     * Lowers a collectible status bar by one of five steps.
     * @returns {void}
     */
    decrease() {
        this.setPercentage(this.percentage - 20);
    }

    /**
     * Resolves the current image index from the percentage.
     * @returns {number} Matching index in the status image array.
     */
    resolveImageIndex() {
        return Math.ceil(this.percentage / 20);
    }
}
