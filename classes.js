export class GlobalState {
    constructor(beat, interval) {
        this.ready = false;
        this.winningCombinations = [{}, {}, {}];
        this.audioQueue = [];
        this.beat = 7;
        this.interval = 1000;
        this.counter = 0;
        this.beatIntervalId = 0;
        this.audiosInDom = {};
        this.allSingers = document.querySelectorAll(".singer");
        this.singersPosition = [];
        this.allSongs = document.querySelectorAll(".song");
        this._allVideoLinks = {
            1: "./public/video1.webm",
            2: "./public/video2.webm",
            3: "./public/video3.webm",
        };
        this._allAudioLinks = {
            1: "./public/1_atlanta.ogg",
            2: "./public/2_tuctom.ogg",
            3: "./public/3_foubreak.ogg",
            4: "./public/4_koukaki.ogg",
            5: "./public/5_koungou.ogg",
            6: "./public/6_bass.ogg",
            7: "./public/7_monk.ogg",
            8: "./public/8_sonar.ogg",
            9: "./public/9_souffle.ogg",
            10: "./public/10_epifle.ogg",
            11: "./public/11_arpeg.ogg",
            12: "./public/12_tromp.ogg",
            13: "./public/13_pizzi.ogg",
            14: "./public/14_organ.ogg",
            15: "./public/15_synth.ogg",
            16: "./public/16_follow.ogg",
            17: "./public/17_choir.ogg",
            18: "./public/18_houhou.ogg",
            19: "./public/19_reach.ogg",
            20: "./public/20_believe.ogg",
        };
        this._allSpriteLinks = (function getAllSpriteLinks(allAudioLinks) {
            const spriteUrls = {};
            for (const id in allAudioLinks) {
                if (Object.prototype.hasOwnProperty.call(allAudioLinks, id)) {
                    let url = allAudioLinks[id];
                    let baseUrl = "/anime/" + url.split("/")[2].replace(".ogg", "-sprite-hd.png");
                    spriteUrls[id] = baseUrl;
                }
            }
            return spriteUrls;
        })(this._allAudioLinks);
        // Objects for cached urls
        this.allCachedAudios = {};
        this.allCachedVideoURL = {};
        this.allCachedSpriteURL = {};
        if (beat && interval) {
            this.beat = beat;
            this.interval = interval;
        }
    }
    get allVideoLinks() {
        return this._allVideoLinks;
    }
    get allAudioLinks() {
        return this._allAudioLinks;
    }
    get allSpriteLinks() {
        return this._allSpriteLinks;
    }
    get getInterval() {
        return this.interval;
    }
    get songs() {
        return this.allSongs;
    }
    get singers() {
        return this.allSingers;
    }
    set setSingers(singers) {
        this.allSingers = singers;
        this.singers.forEach((singer, i) => {
            this.singersPosition[i] = {
                left: singer.offsetLeft,
                right: singer.offsetWidth + singer.offsetLeft,
                top: singer.offsetTop,
                bottom: singer.offsetTop + singer.offsetHeight,
                element: singer,
            };
        });
    }
    get singersPost() {
        return this.singersPosition;
    }
    get getAudiosInDom() {
        return this.audiosInDom;
    }
    set setAudiosInDom({ id, audio }) {
        this.audiosInDom[id] = audio;
    }
    set removeAudioFromDom(id) {
        const audio = this.audiosInDom[id];
        audio.stop();
        delete this.audiosInDom[id];
    }
    get isReady() {
        return this.ready;
    }
    set isLoading(loading) {
        this.ready = !loading;
    }
    get getAudioQueue() {
        return this.audioQueue;
    }
    set setAudioQueue(newAudio) {
        this.audioQueue.push(newAudio);
    }
    set removeAudioFromQueue(audioId) {
        const id = this.audioQueue.findIndex((audio) => audio.id === audioId);
        if (id !== -1) {
            this.audioQueue.splice(id, 1);
        }
    }
}
// Web Audio API
export class Audios {
    constructor(buffer, id) {
        this.audioCtx = new AudioContext();
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
    muteSound(element) {
        if (this.gainNode.gain.value === 1) {
            element.style.opacity = "0.6";
            this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
        }
        else if (this.gainNode.gain.value === 0) {
            element.style.opacity = "1";
            this.gainNode.gain.setValueAtTime(1, this.audioCtx.currentTime);
        }
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
        this.audioSource.stop();
        this.playSound();
    }
}
