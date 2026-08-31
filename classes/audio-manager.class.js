const MUTE_STORAGE_KEY = 'elPolloLocoMuted';

/** Stores and applies the shared mute state for every game sound. */
class AudioManager {
    audioElements = new Set();
    sounds = new Map();
    isMuted = false;

    /** Restores the persisted mute state when the manager is created. */
    constructor() {
        this.isMuted = this.loadMuteState();
    }

    /**
     * Registers an audio element and applies the current mute state.
     * @param {HTMLAudioElement} audioElement - Audio element to register.
     * @returns {HTMLAudioElement} The registered audio element.
     */
    register(audioElement) {
        audioElement.muted = this.isMuted;
        this.audioElements.add(audioElement);
        return audioElement;
    }

    /**
     * Creates and stores one named game sound.
     * @param {string} name - Unique sound name.
     * @param {string} source - Relative path of the audio file.
     * @param {Object} [options={}] - Playback configuration.
     * @param {boolean} [options.loop=false] - Whether playback should loop.
     * @param {number} [options.volume=1] - Playback volume from 0 to 1.
     * @returns {HTMLAudioElement} The created audio element.
     */
    addSound(name, source, options = {}) {
        const audio = this.register(new Audio(source));
        audio.loop = options.loop ?? false;
        audio.volume = options.volume ?? 1;
        audio.preload = 'auto';
        this.sounds.set(name, audio);
        return audio;
    }

    /**
     * Starts a named sound from the beginning.
     * @param {string} name - Registered sound name.
     * @returns {void}
     */
    play(name) {
        const audio = this.sounds.get(name);
        if (!audio) return;
        audio.currentTime = 0;
        const playback = audio.play();
        if (playback) playback.catch(() => {});
    }

    /**
     * Stops and rewinds one named sound.
     * @param {string} name - Registered sound name.
     * @returns {void}
     */
    stop(name) {
        const audio = this.sounds.get(name);
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    }

    /**
     * Stops every sound and rewinds it for the next game.
     * @returns {void}
     */
    stopAll() {
        this.audioElements.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    /**
     * Pauses every active sound without rewinding it.
     * @returns {void}
     */
    pauseAll() {
        this.audioElements.forEach((audio) => audio.pause());
    }

    /**
     * Continues one named sound from its paused position.
     * @param {string} name - Registered sound name.
     * @returns {void}
     */
    resume(name) {
        const audio = this.sounds.get(name);
        if (!audio) return;
        const playback = audio.play();
        if (playback) playback.catch(() => {});
    }

    /**
     * Switches between muted and audible playback.
     * @returns {void}
     */
    toggleMute() {
        this.setMuted(!this.isMuted);
    }

    /**
     * Applies and persists the selected mute state.
     * @param {boolean} isMuted - Whether all sounds should be muted.
     * @returns {void}
     */
    setMuted(isMuted) {
        this.isMuted = isMuted;
        this.audioElements.forEach((audio) => audio.muted = isMuted);
        this.saveMuteState();
    }

    /**
     * Reads the saved state and falls back to audible playback.
     * @returns {boolean} Persisted mute state or false when unavailable.
     */
    loadMuteState() {
        try {
            return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
        } catch (error) {
            return false;
        }
    }

    /**
     * Saves the current state when browser storage is available.
     * @returns {void}
     */
    saveMuteState() {
        try {
            localStorage.setItem(MUTE_STORAGE_KEY, String(this.isMuted));
        } catch (error) {
            return;
        }
    }
}
