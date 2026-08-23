class Endboss extends MovableObject {
    height = 400;
    width = 400;
    y = 60;
    world;
    isActive = false;
    activationDistance = 600;
    speed = 1.25;
    offset = {
        top: 70,
        right: 15,
        bottom: 30,
        left: 30
    };

    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/1_walk/G1.png",
        "img/4_enemie_boss_chicken/1_walk/G2.png",
        "img/4_enemie_boss_chicken/1_walk/G3.png",
        "img/4_enemie_boss_chicken/1_walk/G4.png",
    ];

    constructor() {
        super().loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2500;
        this.animate();
    }

    /** Starts the boss movement and animation intervals. */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 1000 / 10);
    }

    /** Activates and moves the living boss toward Pepe. */
    updateMovement() {
        this.activateIfNearby();
        if (this.isActive && !this.isDead()) this.moveLeft();
    }

    /** Animates the boss only after activation. */
    updateAnimation() {
        if (this.isActive && !this.isDead()) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /** Activates the boss when Pepe enters its detection range. */
    activateIfNearby() {
        if (!this.world || this.isActive) return;
        const distance = this.x - this.world.character.x;
        if (distance < this.activationDistance) this.isActive = true;
    }
}
