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
class GlobalState {
    constructor(beat, interval) {
        this.ready = false;
        this.audioQueue = [];
        this.beat = 7;
        this.interval = 1000;
        this.counter = 0;
        this.beatIntervalId = 0;
        this.audiosInDom = {};
        if (beat && interval) {
            this.beat = beat;
            this.interval = interval;
        }
    }
    get getCounter() {
        return this.counter;
    }
    set setCounter(num) {
        this.counter += num;
    }
    get getInterval() {
        return this.interval;
    }
    get getAudiosInDom() {
        return this.audiosInDom;
    }
    set setAudiosInDom({ id, audio }) {
        this.audiosInDom[id] = audio;
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
}
const global = new GlobalState();
// Resize controller
window.addEventListener("resize", (ev) => {
    if (innerWidth < 768) {
        // Change orientation
    }
});
// Fetch all audio's and videos beforehand
const allVideoLinks = {
    1: "./public/video1.webm",
    2: "./public/video2.webm",
    3: "./public/video3.webm",
};
const allAudioLinks = {
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
const allCachedAudioURL = {};
const allCachedVideoURL = {};
// fetch blog helper function
function fetchBlob(audioLink) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (yield fetch(audioLink)).blob();
            return response;
        }
        catch (err) {
            throw new Error("Invalid URL");
        }
    });
}
// Fetch all audio and video files into memory
function cacheFilesURL(allAudioLinks, allVideoLinks) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const audioLink in allAudioLinks) {
                const audioBlob = yield fetchBlob(allAudioLinks[audioLink]);
                allCachedAudioURL[audioLink] = URL.createObjectURL(audioBlob);
            }
            for (const videoLink in allVideoLinks) {
                const videoBlob = yield fetchBlob(allVideoLinks[videoLink]);
                allCachedVideoURL[videoLink] = URL.createObjectURL(videoBlob);
            }
            global.isLoading = false;
        }
        catch (err) {
            throw new Error();
        }
    });
}
// dragging songs
const songs = document.querySelectorAll(".songs");
songs.forEach((song) => {
    song.addEventListener("pointerdown", handleSongPointerDown);
    song.addEventListener("pointerup", handleSongPointerUp);
});
const singers = document.querySelectorAll(".singer");
const stage = document.querySelector("main");
stage.addEventListener("pointermove", handleStagePointerMove);
// Event handlers
// Buttons
// Testing
const movedSongs = [];
let currentMovingSong = undefined;
function handleSongPointerDown(ev) {
    // console.log("song pointer down");
    currentMovingSong = ev.target;
    if (movedSongs.includes(currentMovingSong)) {
        currentMovingSong = undefined;
    }
    document.body.addEventListener("pointermove", handleBodyPointerMove);
    document.body.addEventListener("pointerup", handleSongPointerUp);
    singers.forEach((singer) => {
        singer.addEventListener("pointerenter", handleSingerPointerEnter);
        singer.addEventListener("pointerleave", handleSingerPointerLeave);
    });
}
function handleSongPointerUp(ev) {
    // console.log("song pointer up");
    if (currentMovingSong) {
        currentMovingSong.style.transform = `translate3d(0px, 0px, 0px)`;
        movedSongs.push(currentMovingSong);
        currentMovingSong = undefined;
    }
    document.body.removeEventListener("pointermove", handleBodyPointerMove);
    document.body.removeEventListener("pointerup", handleSongPointerUp);
    singers.forEach((singer) => {
        singer.removeEventListener("pointerenter", handleSingerPointerEnter);
        singer.removeEventListener("pointerleave", handleSingerPointerLeave);
    });
}
function handleBodyPointerMove(ev) {
    // console.log("song pointer move");
    console.log(ev, "current target", ev.currentTarget, "target", ev.target);
    if (currentMovingSong) {
        currentMovingSong.style.opacity = "0.5";
        currentMovingSong.style.transformOrigin = "center";
        currentMovingSong.style.transform = `translate3d(${ev.clientX - currentMovingSong.offsetLeft}px, ${ev.clientY - currentMovingSong.offsetTop}px, 10px) translate(-50%, -50%) `;
    }
}
// Main stage
function handleStagePointerMove(ev) {
    ev.stopImmediatePropagation();
    // console.log("enter stage");
}
// Singers
function handleSingerPointerEnter(ev) {
    // console.log("enter singer");
    stage.removeEventListener("pointermove", handleStagePointerMove);
}
function handleSingerPointerLeave(ev) {
    // console.log("singer pointer leave");
}
function handleSingerClick(ev) {
    // console.log(ev);
}
function handleSingerPointerDown(ev) {
    // console.log(ev);
}
// customizing the singers
// Playing video
// adding & Playing audio
function addAudio(id) {
    const newAudio = document.createElement("audio");
    newAudio.setAttribute("data-song-id", id);
    newAudio.loop = true;
    newAudio.src = allCachedAudioURL[Number(id)];
    if (Object.keys(global.getAudiosInDom).length === 0) {
        document.body.append(newAudio);
        newAudio.play();
        startBeatInterval();
        global.setAudiosInDom = { id: +id, audio: newAudio };
    }
    else {
        global.setAudioQueue = newAudio;
        global.setAudiosInDom = { id: +id, audio: newAudio };
    }
}
function startBeatInterval() {
    global.beatIntervalId = setInterval(() => {
        global.setCounter += 1;
        if (global.getCounter % global.beat === 0) {
            global.getAudioQueue.forEach((audio, i) => {
                audio.paused && audio.play();
                global.getAudioQueue.splice(i, 1);
            });
        }
    }, global.getInterval);
}
// Muting audio
// Removing audio & clear interval
// Animations
// Start application
cacheFilesURL(allAudioLinks, allVideoLinks).then(() => {
    if (global.isReady) {
        document.getElementsByClassName("splashscreen")[0].style.display = "none";
    }
});
