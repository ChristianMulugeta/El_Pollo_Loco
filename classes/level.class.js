class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    levelEndX = 2250;

    /**
     * Creates a level with moving, background, and collectible objects.
     * @param {MovableObject[]} enemies - Enemies placed in the level.
     * @param {Cloud[]} clouds - Cloud objects placed in the level.
     * @param {BackgroundObject[]} backgroundObjects - Background layers.
     * @param {Coin[]} coins - Collectible coins.
     * @param {Bottle[]} bottles - Collectible bottles.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}
