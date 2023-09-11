"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const audioCtx = new AudioContext();
class Audios {
    constructor(buffer) {
        this.audioCtx = new AudioContext();
        this.audioSource = this.audioCtx.createBufferSource();
        this.gainNode = this.audioCtx.createGain();
        this.buffer = buffer;
        this.audioSource.buffer = this.buffer;
        this.audioSource.loop = true;
        this.audioSource.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
    }
    playSound() {
        this.audioSource = this.audioCtx.createBufferSource();
        this.audioSource.buffer = this.buffer;
        this.audioSource.loop = true;
        this.audioSource.connect(this.gainNode);
    }
    muteSound() {
        if (this.gainNode.gain.value === 1) {
            this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
        }
        else if (this.gainNode.gain.value === 0) {
            this.gainNode.gain.setValueAtTime(1, this.audioCtx.currentTime);
        }
    }
    play() {
        this.audioSource.start();
    }
    stop() {
        this.audioSource.stop();
        this.playSound();
    }
}
// const audioSource = audioCtx.createBufferSource();
// const gainNode = audioCtx.createGain();
// // audioSource.buffer = "buffer"
// audioSource.connect(gainNode);
// gainNode.connect(audioCtx.destination);
// // Mute
// gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
// // Resume
// gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
// // audioCtx.createGain().gain.value = 0
// // audioSource
// const audio1 = {
//   buffer: "elfdkalfd",
//   playsound() {},
//   audioSource: "",
//   gainNode: "",
//   dataSongId: "",
// };
const testObj = {
    1: "../public/1_atlanta.ogg",
    2: "../public/2_tuctom.ogg",
    3: "../public/3_foubreak.ogg",
    4: "../public/4_koukaki.ogg",
    5: "../public/5_koungou.ogg",
    6: "../public/6_bass.ogg",
    7: "../public/7_monk.ogg",
    8: "../public/8_sonar.ogg",
    9: "../public/9_souffle.ogg",
    10: "../public/10_epifle.ogg",
    11: "../public/11_arpeg.ogg",
    12: "../public/12_tromp.ogg",
    13: "../public/13_pizzi.ogg",
    14: "../public/14_organ.ogg",
    15: "../public/15_synth.ogg",
    16: "../public/16_follow.ogg",
    17: "../public/17_choir.ogg",
    18: "../public/18_houhou.ogg",
    19: "../public/19_reach.ogg",
    20: "../public/20_believe.ogg",
};
const audioObj = {};
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        for (const test in testObj) {
            if (Object.prototype.hasOwnProperty.call(testObj, test)) {
                audioObj[test] = yield decodeAudio(testObj[test]);
            }
        }
        console.log(audioObj);
    });
})();
// Implement try catch later
function decodeAudio(audioLink) {
    return __awaiter(this, void 0, void 0, function* () {
        const buffer = (yield fetch(audioLink)).arrayBuffer();
        return new Audios(yield audioCtx.decodeAudioData(yield buffer));
    });
}
