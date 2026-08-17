class ThrowableObject extends MovableObject {

    constructor(x, y) {
        super().loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 50;
        this.throw();
    }


    throw() {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25);
    }

}