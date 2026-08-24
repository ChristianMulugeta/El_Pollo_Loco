class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    levelEndX = 2250;

    /** Creates a level with moving, background, and collectible objects. */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}
