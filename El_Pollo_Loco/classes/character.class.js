class Character extends MovableObject {

    y = 50;
    height = 300;
    width = 200;
    offset = {
        top: 115,
        right: 30,
        bottom: 5,
        left: 30
    };
    speed = 5;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    world;
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-22.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
    }

    /** Starts movement and state-dependent animation intervals. */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 80);
    }

    /** Processes movement, jumping, and the camera position. */
    updateMovement() {
        if (this.isDead()) return;
        this.moveHorizontally();
        this.jumpIfRequested();
        this.world.camera_x = -this.x + 100;
    }

    /** Moves Pepe left or right within the level boundaries. */
    moveHorizontally() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    /** Starts a jump when requested from the ground. */
    jumpIfRequested() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) this.jump();
    }

    /** Plays the highest-priority available animation. */
    updateAnimation() {
        const images = this.getCurrentAnimation();
        if (images) this.playAnimation(images);
    }

    /** Resolves animation priority: dead, hurt, jump, then walk. */
    getCurrentAnimation() {
        if (this.isDead()) return this.IMAGES_DEAD;
        if (this.isHurt()) return this.IMAGES_HURT;
        if (this.isAboveGround()) return this.IMAGES_JUMPING;
        if (this.isMoving()) return this.IMAGES_WALKING;
        return null;
    }

    /** Checks whether a horizontal movement key is held. */
    isMoving() {
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }

    /** Gives Pepe upward velocity. */
    jump() {
        this.speedY = 25;
    }

}
