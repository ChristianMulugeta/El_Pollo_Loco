class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;

    /** Creates a cloud at a random horizontal position. */
    constructor() {
        super();
        this.loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;
        this.animate();
    }

    /** Starts the cloud's continuous movement to the left. */
    animate() {
        this.startInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

}
