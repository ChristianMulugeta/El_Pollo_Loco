class ThrowableObject extends MovableObject {
    horizontalSpeed;

    /** Creates a bottle and launches it in the selected direction. */
    constructor(x, y, facingLeft = false) {
        super().loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 50;
        this.horizontalSpeed = facingLeft ? -10 : 10;
        this.throw();
    }

    /** Applies the bottle's vertical and horizontal movement. */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += this.horizontalSpeed;
        }, 25);
    }
}
