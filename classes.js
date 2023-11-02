export class GlobalState {
    timeouts = {};
    randomMix = [[], [], [], []]; // Maybe v1.1
    mix = [
        [1, 3, 5, 9],
        [1, 4, 6, 10],
        [2, 5, 7, 11],
    ]; // Maybe v1.1
    userMix = [[], [], []];
    version = 0;
    autoInterval = 0;
    audiosInDom = {};
    audioQueue = [];
    autoQueue = [];
    beat = 70;
    transition = 0;
    beatIntervalId = 0;
    allAudios = {};
    allVideo = {};
    allSprites = {};
    currentMovingSong = undefined;
    animeFrames = {};
    allSongs = [];
    allLoaders = [];
    allSingers = [];
    allVideoPlayers = [];
    singersPost = [];
    /**
     * getAudioLength
     * getSprite
     *
     */
    getAudioLength(songId) {
        return this.allAudios[songId]?.buffer.duration;
    }
    getSprite(songId) {
        return this.allSprites[songId];
    }
    set setVersion(version) {
        this.version = version;
    }
}
export class Audios {
    audioCtx = new AudioContext();
    buffer;
    audioSource;
    gainNode;
    id;
    constructor(buffer, id) {
        this.audioSource = this.audioCtx.createBufferSource();
        this.gainNode = this.audioCtx.createGain();
        this.buffer = buffer;
        this.audioSource.buffer = this.buffer;
        this.audioSource.loop = true;
        this.audioSource.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
        this.id = id;
    }
    playSound() {
        this.audioSource = this.audioCtx.createBufferSource();
        this.audioSource.buffer = this.buffer;
        this.audioSource.loop = true;
        this.audioSource.connect(this.gainNode);
    }
    isMute() {
        return this.gainNode.gain.value;
    }
    muteSound() {
        this.gainNode.gain.value = 0;
    }
    unmuteSound() {
        this.gainNode.gain.value = 1;
    }
    play() {
        try {
            this.audioSource.start();
        }
        catch (error) {
            this.playSound();
            this.audioSource.start();
        }
    }
    stop() {
        try {
            this.audioSource.stop();
            this.playSound();
        }
        catch (error) {
            this.playSound();
            this.audioSource.start();
            this.audioSource.stop();
        }
    }
}
