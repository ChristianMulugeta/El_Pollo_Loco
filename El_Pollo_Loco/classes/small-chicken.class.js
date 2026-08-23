const SMALL_CHICKEN_WALKING_IMAGES = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
];

class SmallChicken extends Chicken {
    /** Creates a smaller and faster chicken. */
    constructor() {
        super(SMALL_CHICKEN_WALKING_IMAGES, 50, 0.65, 0.45);
        this.offset = { top: 3, right: 2, bottom: 5, left: 2 };
    }
}
