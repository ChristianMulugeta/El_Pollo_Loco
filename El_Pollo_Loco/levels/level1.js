const LEVEL1_BACKGROUND_PATHS = [
    'air.png', '3_third_layer/2.png', '2_second_layer/2.png', '1_first_layer/2.png',
    'air.png', '3_third_layer/1.png', '2_second_layer/1.png', '1_first_layer/1.png',
    'air.png', '3_third_layer/2.png', '2_second_layer/2.png', '1_first_layer/2.png',
    'air.png', '3_third_layer/1.png', '2_second_layer/1.png', '1_first_layer/1.png',
    'air.png', '3_third_layer/2.png', '2_second_layer/2.png', '1_first_layer/2.png'
];

/** Creates the first level when a game starts. */
function createLevel1() {
    return new Level(createLevel1Enemies(), createLevel1Clouds(), createLevel1Background());
}

/** Creates all enemies for the first level. */
function createLevel1Enemies() {
    return [new Chicken(), new Chicken(), new Chicken(), new Endboss()];
}

/** Creates all clouds for the first level. */
function createLevel1Clouds() {
    return [new Cloud()];
}

/** Creates the repeating background layers for the first level. */
function createLevel1Background() {
    const basePath = 'img/5_background/layers/';
    return LEVEL1_BACKGROUND_PATHS.map((path, index) => {
        const x = Math.floor(index / 4) * 720 - 720;
        return new BackgroundObject(basePath + path, x);
    });
}
