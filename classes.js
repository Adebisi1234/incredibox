var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cropImage, { clearRect } from "./anime/croppingImage/crop.js";
export class GlobalState {
    constructor(beat, interval) {
        this.ready = false;
        this.audioQueue = [];
        this.beat = 7;
        this.interval = 1000;
        this.counter = 0;
        this.anime = {};
        this.beatIntervalId = 0;
        this.coolCombination = {
            1: [1, 10, 19],
            2: [2, 10, 5],
            3: [5, 15, 2],
        }; // For auto-play feature. placeholder for now
        this.winningCombination = {
            1: [1, 10, 19],
            2: [2, 10, 5],
            3: [5, 15, 2],
        };
        this.audiosInDom = {};
        this.allSingers = document.querySelectorAll(".singer");
        this.videoPlayer = document.querySelectorAll(".video-player");
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
                    let baseUrl = "/anime/" + url.split("/")[2].replace(".ogg", "-sprite.png");
                    spriteUrls[id] = baseUrl;
                }
            }
            return spriteUrls;
        })(this._allAudioLinks);
        this.allAnimeURl = (function (allSpriteLinks) {
            const animeJson = {};
            for (const id in allSpriteLinks) {
                if (Object.prototype.hasOwnProperty.call(allSpriteLinks, id)) {
                    let url = allSpriteLinks[id];
                    let baseUrl = url.replace("-sprite.png", ".json");
                    animeJson[id] = baseUrl;
                }
            }
            return animeJson;
        })(this._allSpriteLinks);
        this.allStaticSpriteLinks = (function (allSpriteLinks) {
            const staticURls = {};
            for (const id in allSpriteLinks) {
                if (Object.prototype.hasOwnProperty.call(allSpriteLinks, id)) {
                    let url = allSpriteLinks[id];
                    let baseUrl = url.replace("-sprite.png", "-sprite-hd.png");
                    staticURls[id] = baseUrl;
                }
            }
            return staticURls;
        })(this._allSpriteLinks);
        // Objects for cached urls
        this.allCachedAudios = {};
        this.allCachedVideoURL = {};
        this.allCachedSpriteURL = {};
        this.allCachedStaticSpriteURL = {};
        this.allAnimeIntervalId = {};
        if (beat && interval) {
            this.beat = beat;
            this.interval = interval;
        }
    }
    animate(audioId, headCanvas, bodyCanvas) {
        return __awaiter(this, void 0, void 0, function* () {
            const audio = this.audiosInDom[audioId];
            const singerId = document
                .querySelector(`.singer[data-song-id="${audioId}"]`)
                .getAttribute("data-singer-id");
            document.documentElement.style.setProperty(`--background-${singerId}`, `url("")`);
            const animeJson = this.anime[audioId];
            const image = yield createImageBitmap(this.allCachedSpriteURL[audioId]);
            const timeout = (audio.buffer.duration * 1000) / animeJson.arrayFrame.length;
            cropImage(bodyCanvas, image, 164, 0, +animeJson.width, +animeJson.height);
            if (!this.allAnimeIntervalId[audioId] ||
                Object.keys(this.allAnimeIntervalId[audioId]).length === 0) {
                this.allAnimeIntervalId[audioId] = {
                    i: 0,
                    intervalId: (() => {
                        const frame = () => {
                            var _a;
                            let i = (_a = this.allAnimeIntervalId[audioId].i) !== null && _a !== void 0 ? _a : 0;
                            const [x, y, translateX, translateY] = animeJson.arrayFrame[i].prop;
                            if (!this.allAnimeIntervalId[audioId].clear) {
                                cropImage(headCanvas, image, x, y, +animeJson.width, +animeJson.headHeight);
                                headCanvas.parentElement.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
                            }
                            this.allAnimeIntervalId[audioId].i
                                ? this.allAnimeIntervalId[audioId].i++
                                : (this.allAnimeIntervalId[audioId].i = 1);
                            if (this.allAnimeIntervalId[audioId].i === animeJson.arrayFrame.length) {
                                this.allAnimeIntervalId[audioId].i = 0;
                            }
                            setTimeout(() => {
                                requestAnimationFrame(frame);
                            }, timeout);
                        };
                        requestAnimationFrame(frame);
                    })(),
                    clear: false,
                };
            }
            else {
                this.allAnimeIntervalId[audioId].clear = false;
            }
        });
    }
    pauseAnimation(audioId, headCanvas, bodyCanvas) {
        this.allAnimeIntervalId[audioId].clear = true;
        clearRect(headCanvas);
        clearRect(bodyCanvas);
    }
    clearAnimation(audioId, headCanvas, bodyCanvas) {
        delete this.allAnimeIntervalId[audioId];
        clearRect(headCanvas);
        clearRect(bodyCanvas);
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
                height: singer.offsetHeight,
                width: singer.offsetWidth,
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
        const id = this.audioQueue.findIndex((audio) => audio.audio.id === audioId);
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
