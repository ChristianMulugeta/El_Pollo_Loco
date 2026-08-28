const END_BOSS_STATUS_IMAGES = [
    'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
];

class EndbossStatusBar extends StatusBar {
    /** Creates a full boss status bar at the top right. */
    constructor() {
        super(END_BOSS_STATUS_IMAGES, 0, 100);
        this.x = 440;
    }
}
