class Character extends MovableObject {

    y = 120;
    height = 300;
    width = 200;
    offset = {
        top: 115,
        right: 30,
        bottom: 5,
        left: 30
    };
    speed = 5;
    inactivityTime = 15000;
    isSnoring = false;
    jumpImageIndex = 0;
    wasJumping = false;
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-11.png',
        'img/2_character_pepe/1_idle/idle/I-12.png',
        'img/2_character_pepe/1_idle/idle/I-13.png',
        'img/2_character_pepe/1_idle/idle/I-14.png',
        'img/2_character_pepe/1_idle/idle/I-15.png',
        'img/2_character_pepe/1_idle/idle/I-16.png',
        'img/2_character_pepe/1_idle/idle/I-17.png',
        'img/2_character_pepe/1_idle/idle/I-18.png',
        'img/2_character_pepe/1_idle/idle/I-19.png',
        'img/2_character_pepe/1_idle/idle/I-20.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-21.png',
        'img/2_character_pepe/1_idle/long_idle/I-22.png',
        'img/2_character_pepe/1_idle/long_idle/I-23.png',
        'img/2_character_pepe/1_idle/long_idle/I-24.png',
        'img/2_character_pepe/1_idle/long_idle/I-25.png',
        'img/2_character_pepe/1_idle/long_idle/I-26.png',
        'img/2_character_pepe/1_idle/long_idle/I-27.png',
        'img/2_character_pepe/1_idle/long_idle/I-28.png',
        'img/2_character_pepe/1_idle/long_idle/I-29.png',
        'img/2_character_pepe/1_idle/long_idle/I-30.png'
    ];

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
    /** Creates Pepe and starts gravity, movement, and animation. */
    constructor() {
        super();
        this.loadImage('img/2_character_pepe/2_walk/W-22.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
    }

    /**
     * Starts movement and state-dependent animation intervals.
     * @returns {void}
     */
    animate() {
        this.startInterval(() => this.updateMovement(), 1000 / 60);
        this.startInterval(() => this.updateAnimation(), 80);
    }

    /**
     * Processes movement, jumping, and the camera position.
     * @returns {void}
     */
    updateMovement() {
        if (this.isDead() || this.world.gameEnding) return;
        this.moveHorizontally();
        this.jumpIfRequested();
        this.world.cameraX = -this.x + 100;
    }

    /**
     * Moves Pepe left or right within the level boundaries.
     * @returns {void}
     */
    moveHorizontally() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    /**
     * Starts a jump when requested from the ground.
     * @returns {void}
     */
    jumpIfRequested() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) this.jump();
    }

    /**
     * Plays the highest-priority available animation.
     * @returns {void}
     */
    updateAnimation() {
        if (this.isDead()) {
            this.updateSnoring(false);
            this.playAnimation(this.IMAGES_DEAD);
            return;
        }
        if (this.isAboveGround()) {
            this.updateSnoring(false);
            this.playJumpAnimation();
            return;
        }
        if (this.wasJumping) {
            this.finishJumpAnimation();
            return;
        }
        const images = this.getCurrentAnimation();
        this.updateSnoring(images === this.IMAGES_LONG_IDLE);
        if (images) this.playAnimation(images);
    }

    /**
     * Displays every jump frame once and holds the final airborne frame.
     * @returns {void}
     */
    playJumpAnimation() {
        if (!this.wasJumping) this.jumpImageIndex = 0;
        const lastIndex = this.IMAGES_JUMPING.length - 1;
        const imagePath = this.IMAGES_JUMPING[this.jumpImageIndex];
        this.img = this.imageCache[imagePath];
        this.jumpImageIndex = Math.min(this.jumpImageIndex + 1, lastIndex);
        this.wasJumping = true;
    }

    /**
     * Shows the last jump frame on landing and resets the jump state.
     * @returns {void}
     */
    finishJumpAnimation() {
        const lastImage = this.IMAGES_JUMPING[this.IMAGES_JUMPING.length - 1];
        this.img = this.imageCache[lastImage];
        this.jumpImageIndex = 0;
        this.wasJumping = false;
    }

    /**
     * Starts or stops snoring when Pepe changes sleep state.
     * @param {boolean} shouldSnore - Whether the snoring sound should play.
     * @returns {void}
     */
    updateSnoring(shouldSnore) {
        if (shouldSnore === this.isSnoring) return;
        this.isSnoring = shouldSnore;
        if (shouldSnore) this.world.playSound(GAME_SOUNDS.SNORE);
        else this.world.stopSound(GAME_SOUNDS.SNORE);
    }

    /**
     * Resolves animation priority from dead through sleep.
     * @returns {string[]} Image paths for the active animation.
     */
    getCurrentAnimation() {
        if (this.isDead()) return this.IMAGES_DEAD;
        if (this.isHurt()) return this.IMAGES_HURT;
        if (this.isMoving()) return this.IMAGES_WALKING;
        if (this.isLongIdle()) return this.IMAGES_LONG_IDLE;
        return this.IMAGES_IDLE;
    }

    /**
     * Checks whether Pepe has received no input for 15 seconds.
     * @returns {boolean} Whether Pepe has been inactive long enough.
     */
    isLongIdle() {
        return Date.now() - this.world.keyboard.lastInput >= this.inactivityTime;
    }

    /**
     * Checks whether a horizontal movement key is held.
     * @returns {boolean} Whether left or right movement is active.
     */
    isMoving() {
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }

    /**
     * Gives Pepe upward velocity.
     * @returns {void}
     */
    jump() {
        this.jumpImageIndex = 0;
        this.wasJumping = false;
        this.speedY = 25;
        this.world.playSound(GAME_SOUNDS.JUMP);
    }

}
