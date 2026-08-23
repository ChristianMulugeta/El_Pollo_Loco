class Endboss extends MovableObject {
    height = 400;
    width = 400;
    y = 60;
    world;
    isActive = false;
    activationDistance = 600;
    attackDistance = 220;
    state = 'idle';
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

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACKING = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    constructor() {
        super().loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
        this.loadImages([
            ...this.IMAGES_WALKING,
            ...this.IMAGES_ALERT,
            ...this.IMAGES_ATTACKING
        ]);
        this.x = 2500;
        this.animate();
    }

    /** Starts the boss movement and animation intervals. */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 1000 / 10);
    }

    /** Activates, selects a state, and moves the boss when appropriate. */
    updateMovement() {
        this.activateIfNearby();
        if (!this.isActive || this.isDead() || this.state === 'alert') return;
        this.updateCombatState();
        if (this.state === 'walk') this.moveLeft();
    }

    /** Selects walking or attacking based on Pepe's distance. */
    updateCombatState() {
        const distance = this.x - this.world.character.x;
        const nextState = distance <= this.attackDistance ? 'attack' : 'walk';
        this.setBossState(nextState);
    }

    /** Animates the current active boss state. */
    updateAnimation() {
        if (!this.isActive || this.isDead()) return;
        if (this.state === 'alert') {
            this.playAlertAnimation();
            return;
        }
        const images = this.state === 'attack'
            ? this.IMAGES_ATTACKING : this.IMAGES_WALKING;
        this.playAnimation(images);
    }

    /** Plays the alert sequence once before the boss starts moving. */
    playAlertAnimation() {
        if (this.currentImage >= this.IMAGES_ALERT.length) {
            this.setBossState('walk');
            return;
        }
        this.playAnimation(this.IMAGES_ALERT);
    }

    /** Changes state and restarts its animation sequence. */
    setBossState(state) {
        if (this.state === state) return;
        this.state = state;
        this.currentImage = 0;
    }

    /** Activates the boss when Pepe enters its detection range. */
    activateIfNearby() {
        if (!this.world || this.isActive) return;
        const distance = this.x - this.world.character.x;
        if (distance >= this.activationDistance) return;
        this.isActive = true;
        this.setBossState('alert');
    }
}
