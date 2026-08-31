/** Stores the pressed state of every control used by the game. */
class Keyboard {

    LEFT = false;
    RIGHT = false;
    SPACE = false;
    R = false;
    lastInput = Date.now();

    /**
     * Records the latest keyboard or touch interaction.
     * @returns {void}
     */
    recordInput() {
        this.lastInput = Date.now();
    }
}
