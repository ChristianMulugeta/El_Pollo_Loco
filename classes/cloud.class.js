class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;

    /** Creates a cloud at the given horizontal position. */
    constructor(x) {
        super();
        this.loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = x;
        this.animate();
    }

    /** Starts the cloud's continuous movement to the left. */
    animate() {
        this.startInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

}
