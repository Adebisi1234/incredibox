var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// I PITY WHOEVER GOES THROUGH THIS CODE
import { GlobalState, Audios } from "./classes.js";
// Constants
const audioCtx = new AudioContext();
const global = new GlobalState();
// For Stopping Songs
let pointerDownTop = 0;
let pointerUpTop = 0;
let pointerDownLeft = 0;
let pointerUpLeft = 0;
// Updating the singers size on DOM load
window.addEventListener("DOMContentLoaded", () => {
    global.setSingers = document.querySelectorAll(".singer");
    cacheFiles(global.allAudioLinks, global.allVideoLinks, global.allSpriteLinks, global.allStaticSpriteLinks, global.allAnimeURl)
        .then(() => {
        if (global.isReady) {
            document.getElementsByClassName("splashscreen")[0].style.display = "none";
            global.singers.forEach((singer) => {
                singer.addEventListener("click", handlePauseAudio);
                singer.addEventListener("pointerdown", handleRemoveAudio);
                singer.addEventListener("pointerup", handleRemoveAudio);
            });
            // dragging songs
            global.songs.forEach((song) => {
                song.addEventListener("pointerdown", startSongDrag);
                song.addEventListener("pointerup", startSinging);
            });
        }
    })
        .catch((err) => (document.body.textContent = `An error occurred ${err}`));
});
window.addEventListener("resize", () => {
    global.setSingers = document.querySelectorAll(".singer");
});
let currentMovingSong = undefined;
// CacheFiles and start application function
// Start application
// const stage: HTMLElement = document.querySelector("main")!;
// fetch blog helper function
// Singers main events
// Event handlers
function handlePauseAudio(ev) {
    const element = getSinger(ev);
    const audioId = element.getAttribute("data-song-id");
    if (!audioId) {
        return;
    }
    else {
        const audio = global.getAudiosInDom[+audioId];
        if (audio) {
            const headCanvas = element.querySelector(".head-canvas");
            const bodyCanvas = element.querySelector(".body-canvas");
            if (element.style.opacity === "1") {
                document.documentElement.style.setProperty(`--background-${element.getAttribute("data-singer-id")}`, `url("${global.allCachedStaticSpriteURL[+audioId]}")`);
                global.pauseAnimation(audioId, headCanvas, bodyCanvas);
            }
            else {
                global.animate(audioId, headCanvas, bodyCanvas);
            }
            audio.muteSound(element);
        }
    }
}
function startSongDrag(ev) {
    const container = ev.target.classList.contains("left") ||
        ev.target.classList.contains("right");
    currentMovingSong = container ? undefined : ev.target;
    if (!currentMovingSong ||
        Object.keys(global.getAudiosInDom).includes(currentMovingSong.getAttribute("data-song-id"))) {
        currentMovingSong = undefined;
    }
    // stage.addEventListener("pointerover", handleStagePointerMove);
    modifyBodyEvents("add");
    // singers.forEach((singer) => {
    //   singer.addEventListener("pointerover", handleSingerPointerOver);
    //   singer.addEventListener("pointerleave", handleSingerPointerLeave);
    // });
}
function startSinging(ev) {
    if (currentMovingSong) {
        const { left, right, top, bottom } = getMovingSongPosition(ev);
        global.singersPost.forEach((singer) => {
            const isInsideSinger = singer.left < left &&
                right < singer.right &&
                singer.top < top &&
                bottom < singer.bottom;
            if (isInsideSinger) {
                const id = currentMovingSong.getAttribute("data-song-id");
                isSingerSinging(true, singer.element, id);
                const headCanvas = singer.element.querySelector(".head-canvas");
                const bodyCanvas = singer.element.querySelector(".body-canvas");
                addAudio(id, headCanvas, bodyCanvas);
                currentMovingSong.style.transform = `translate3d(0px, 0px, 0px)`;
                currentMovingSong = undefined;
            }
        });
        removeMovingSongStyles(currentMovingSong);
    }
    modifyBodyEvents("remove");
    // stage.removeEventListener("pointerover", handleStagePointerMove);
    // singers.forEach((singer) => {
    //   // singer.removeEventListener("pointerover", handleSingerPointerOver);
    //   singer.removeEventListener("pointerleave", handleSingerPointerLeave);
    // });
}
// Main stage
// function handleStagePointerMove(ev: PointerEvent): void {
//
//   if (
//     currentMovingSong &&
//     ((ev.target as HTMLDivElement).classList.contains("frame") ||
//       (ev.target as HTMLDivElement).classList.contains("singers"))
//   ) {
//     console.log("enter singer");
//     (ev.target as HTMLDivElement).classList.add("entered");
//   }
// }
// Singers
// function handleSingerPointerOver(ev: PointerEvent): void {
//   //
// }
// function handleSingerPointerLeave(ev: PointerEvent): void {
//   // console.log("singer pointer leave");
// }
function handleRemoveAudio(ev) {
    const target = getSinger(ev);
    const id = target.getAttribute("data-song-id");
    const singerId = target.getAttribute("data-singer-id");
    if (!id || !singerId) {
        return;
    }
    if (ev.type === "pointerdown") {
        pointerDownTop = ev.clientY;
        pointerDownLeft = ev.clientX;
    }
    else if (ev.type === "pointerup") {
        pointerUpTop = ev.clientY;
        pointerUpLeft = ev.clientX;
    }
    if (pointerDownTop !== 0 &&
        pointerUpTop !== 0 &&
        pointerDownLeft !== 0 &&
        pointerUpLeft !== 0 &&
        pointerUpTop - pointerDownTop > 20 &&
        pointerUpLeft - pointerDownLeft < 20) {
        stopSong(id, target);
        pointerUpTop = 0;
        pointerDownTop = 0;
        pointerUpLeft = 0;
        pointerDownLeft = 0;
    }
}
// customizing the singers
// Playing video
// adding & Playing audio
function addAudio(id, headCanvas, bodyCanvas) {
    const newAudio = global.allCachedAudios[+id];
    global.setAudioQueue = { audio: newAudio, headCanvas, bodyCanvas };
    if (Object.keys(global.getAudiosInDom).length === 0) {
        startBeatInterval();
    }
    isWinningCombination();
}
function handlePlayVideo(target) {
    // This can also be better
    const video = target;
    const audioId = `2${video.id}`;
    if (video) {
        video.src = global.allCachedVideoURL[+video.id];
        video.addEventListener("ended", handleStopVideo);
        video.parentElement.style.height = "100vh";
        video.parentElement.style.width = "100vw";
        document
            .querySelector(`.video-player[data-player-id="${video.id}"]`)
            .lastElementChild.classList.remove("loading");
        setTimeout(() => {
            video.play();
            global.allCachedAudios[audioId].play();
        }, 200);
    }
    for (const audio in global.getAudiosInDom) {
        if (Object.prototype.hasOwnProperty.call(global.getAudiosInDom, audio)) {
            const audioId = global.getAudiosInDom[audio].id;
            const element = document.querySelector(`.singer[data-song-id="${audioId}"]`);
            global.getAudiosInDom[audio].muteSound(element, true);
        }
    }
    function handleStopVideo() {
        if (video) {
            video.parentElement.style.height = "0vh";
            global.allCachedAudios[audioId].stop();
            global.setVideoInQueue = undefined;
            for (const audio in global.getAudiosInDom) {
                if (Object.prototype.hasOwnProperty.call(global.getAudiosInDom, audio)) {
                    const audioId = global.getAudiosInDom[audio].id;
                    const element = document.querySelector(`.singer[data-song-id="${audioId}"]`);
                    global.getAudiosInDom[audio].muteSound(element);
                }
            }
        }
    }
}
// Beat && loader
function startBeatInterval() {
    document.documentElement.style.setProperty("--transition-time", `${global.counter % global.beat}s`);
    if (global.getAudioQueue.length === 1) {
        const audioObj = global.getAudioQueue[0];
        audioObj.audio.play();
        global.setAudiosInDom = { id: +audioObj.audio.id, audio: audioObj.audio };
        global.animate(audioObj.audio.id, audioObj.headCanvas, audioObj.bodyCanvas);
    }
    global.beatIntervalId = setInterval(() => {
        global.counter += 1;
        if (global.counter % global.beat === 0) {
            global.getAudioQueue.forEach((audioObj, i) => {
                if (!global.getAudiosInDom[audioObj.audio.id]) {
                    global.setAudiosInDom = {
                        id: +audioObj.audio.id,
                        audio: audioObj.audio,
                    };
                    global.animate(audioObj.audio.id, audioObj.headCanvas, audioObj.bodyCanvas);
                    audioObj.audio.play();
                    document
                        .querySelector(`.singer[data-song-id="${audioObj.audio.id}"]`)
                        .lastElementChild.classList.remove("loading");
                }
                global.getAudioQueue.splice(i, 1);
            });
        }
    }, global.getInterval);
}
// Muting audio
// Loading indicator animation
// Removing audio & clear interval
// Animations
function handleMovingSong(ev) {
    if (currentMovingSong) {
        movingSongStyles(ev, currentMovingSong);
        highlightHoveredSinger(ev);
        // Implement moving eyes
        document.querySelectorAll(".singer .eye").forEach((eye) => {
            const x = eye.offsetLeft + eye.offsetWidth / 2;
            const y = eye.offsetTop + eye.offsetHeight / 2;
            const rotate = Math.atan2(ev.clientY + y, ev.clientX + x);
            eye.style.transform = `rotate(${rotate}deg)`;
        });
    }
}
// Helper functions
function cacheFiles(allAudioLinks, allVideoLinks, allSpriteLinks, allStaticSpriteLinks, allAnimeLinks) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const audioLink in allAudioLinks) {
                global.allCachedAudios[audioLink] = yield decodeAudio(allAudioLinks[audioLink], audioLink);
            }
            for (const videoLink in allVideoLinks) {
                const videoBlob = yield fetchBlob(allVideoLinks[videoLink]);
                global.allCachedVideoURL[videoLink] = URL.createObjectURL(videoBlob);
            }
            for (const spriteLink in allSpriteLinks) {
                global.allCachedSpriteURL[spriteLink] = yield fetchBlob(allSpriteLinks[spriteLink]);
            }
            for (const staticSpriteLink in allStaticSpriteLinks) {
                const staticSpriteBlob = yield fetchBlob(allStaticSpriteLinks[staticSpriteLink]);
                global.allCachedStaticSpriteURL[staticSpriteLink] =
                    URL.createObjectURL(staticSpriteBlob);
            }
            for (const animeLink in allAnimeLinks) {
                const animeJSON = yield fetchJson(allAnimeLinks[animeLink]);
                global.anime[animeLink] = animeJSON;
            }
            global.isLoading = false;
        }
        catch (err) {
            console.log(err);
        }
    });
}
function getMovingSongPosition(ev) {
    const position = { left: 0, top: 0, right: 0, bottom: 0 };
    position.left = ev.clientX;
    position.right = position.left + currentMovingSong.offsetWidth / 2; // taking Translate(-50%, -50%) above into account
    position.top = ev.clientY;
    position.bottom = position.top + currentMovingSong.offsetHeight / 2; // taking Translate(-50%, -50%) above into account
    return position;
}
function isSingerSinging(isSinging, singer, id) {
    const singerId = singer.getAttribute("data-singer-id");
    const loader = singer.lastElementChild;
    if (isSinging) {
        Object.keys(global.getAudiosInDom).length !== 0 &&
            global.counter % global.beat !== 0 &&
            loader.classList.add("loading");
        singer.style.opacity = "1";
        singer.setAttribute("data-song-id", id);
        singer.classList.add("singing");
        document.documentElement.style.setProperty(`--background-${singerId}`, `url("${global.allCachedStaticSpriteURL[+id]}")`);
    }
    else {
        singer.classList.remove("singing");
        singer.style.opacity = "0.6";
        singer.removeAttribute("data-song-id");
        loader.classList.remove("loading");
        document.querySelector(`.song[data-song-id='${id}']`).style.opacity = "1";
        document.querySelector(`.song[data-song-id='${id}']`).style.backgroundPositionY = `0`;
        document.documentElement.style.setProperty(`--background-${singerId}`, `url("/public/singer.png")`);
    }
}
function modifyBodyEvents(type) {
    if (type === "add") {
        document.body.addEventListener("pointermove", handleMovingSong);
        document.body.addEventListener("pointercancel", startSinging);
        document.body.addEventListener("pointerup", startSinging);
    }
    else if (type === "remove") {
        document.body.removeEventListener("pointermove", handleMovingSong);
        document.body.removeEventListener("pointercancel", startSinging);
        document.body.removeEventListener("pointerup", startSinging);
    }
}
function movingSongStyles(ev, currentMovingSong) {
    const x = ev.clientX - currentMovingSong.offsetLeft;
    const y = ev.clientY - currentMovingSong.offsetTop;
    currentMovingSong.style.transform = `translate3d(${x % innerWidth}px, ${y % innerHeight}px, 10px) translate(-50%, -50%) `;
    currentMovingSong.style.backgroundPositionY = "100%";
}
function removeMovingSongStyles(currentMovingSong) {
    if (currentMovingSong) {
        currentMovingSong.style.transform = `translate3d(0px, 0px, 0px)`;
        currentMovingSong.style.backgroundPositionY = "0";
        currentMovingSong = undefined;
        global.singers.forEach((singer) => singer.classList.remove("active"));
    }
}
function stopSong(id, target) {
    const headCanvas = target.querySelector(".head-canvas");
    const bodyCanvas = target.querySelector(".body-canvas");
    document.documentElement.style.setProperty(`background-${id}`, "/public/singer.png");
    global.clearAnimation(id, headCanvas, bodyCanvas);
    isSingerSinging(false, target, id);
    global.removeAudioFromQueue = id;
    if (global.getAudiosInDom[+id]) {
        global.removeAudioFromDom = +id;
    }
    if (Object.keys(global.getAudiosInDom).length === 0) {
        document.documentElement.style.setProperty("--transition-time", "0s");
    }
    isWinningCombination();
}
function isWinningCombination() {
    // There has to be a better way than this
    for (const combination in global.winningCombination) {
        if (Object.prototype.hasOwnProperty.call(global.winningCombination, combination)) {
            let win = global.winningCombination[combination].every((songId) => {
                var _a, _b;
                if (((_a = global.getAudioQueue[global.getAudioQueue.length - 1]) === null || _a === void 0 ? void 0 : _a.audio.id) ===
                    String(songId)) {
                    gettingHot(combination, songId, true);
                }
                if (global.getAudiosInDom[songId] ||
                    ((_b = global.getAudioQueue[global.getAudioQueue.length - 1]) === null || _b === void 0 ? void 0 : _b.audio.id) ===
                        String(songId)) {
                    return true;
                }
                else {
                    return false;
                }
            });
            if (win) {
                const player = document.querySelector(`.video-player[data-player-id="${combination}"]`);
                player.classList.add("playable");
                player.addEventListener("click", () => {
                    var _a;
                    const video = document.getElementsByTagName("video")[0];
                    video.id = player.id;
                    player.lastElementChild.classList.add("loading");
                    console.log("are we here");
                    setTimeout(() => {
                        handlePlayVideo(video);
                    }, (global.counter % global.beat) * 1000);
                    global.setVideoInQueue = video;
                    (_a = player.nextElementSibling) === null || _a === void 0 ? void 0 : _a.classList.add("loading");
                });
            }
        }
    }
}
function gettingHot(videoPlayerId, songId, add) {
    console.log(songId);
    const videoPlayer = document.querySelector(`.video-player[data-player-id="${videoPlayerId}"]`);
    if (add) {
        switch (true) {
            case videoPlayer === null || videoPlayer === void 0 ? void 0 : videoPlayer.classList.contains("combo2"):
                videoPlayer === null || videoPlayer === void 0 ? void 0 : videoPlayer.classList.add("combo3");
                return;
            case videoPlayer === null || videoPlayer === void 0 ? void 0 : videoPlayer.classList.contains("combo1"):
                videoPlayer === null || videoPlayer === void 0 ? void 0 : videoPlayer.classList.add("combo2");
                return;
            default:
                videoPlayer.classList.add("combo1");
                return;
        }
    }
    else {
        // Use another function entirely
        //  switch (true) {
        //    case videoPlayer?.classList.contains("combo1"):
        //      videoPlayer?.classList.remove("combo1");
        //      return;
        //    case videoPlayer?.classList.contains("combo2"):
        //      videoPlayer?.classList.remove("combo2");
        //      return;
        //    default:
        //      videoPlayer?.classList.remove("combo3");
        //      return;
        //  }
    }
}
function fetchBlob(link) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (yield fetch(link)).blob();
            return response;
        }
        catch (err) {
            throw new Error("Invalid URL");
        }
    });
}
function fetchJson(link) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (yield fetch(link)).json();
            const edit = Object.assign(Object.assign({}, response), { arrayFrame: response.arrayFrame.map(({ prop }) => {
                    let x = prop.split(",")[0];
                    x = +x;
                    let y = prop.split(",")[1];
                    y = +y;
                    let translateX = prop.split(",")[2];
                    translateX = +translateX;
                    let translateY = prop.split(",")[3];
                    translateY = +translateY;
                    return { prop: [x, y, translateX, translateY] };
                }) });
            return edit;
        }
        catch (err) {
            throw new Error("Invalid URL");
        }
    });
}
// Gotta make this better
function getSinger(ev) {
    if (ev.target.classList.contains("frame")) {
        return ev.target.parentElement;
    }
    else if (ev.target.classList.contains("body")) {
        return ev.target.parentElement
            .parentElement;
    }
    else if (ev.target.classList.contains("body-canvas")) {
        return ev.target.parentElement.parentElement
            .parentElement;
    }
    else if (ev.target.classList.contains("head")) {
        return ev.target.parentElement.parentElement
            .parentElement;
    }
    else if (ev.target.classList.contains("head-canvas")) {
        return ev.target.parentElement.parentElement
            .parentElement.parentElement;
    }
    return ev.target;
}
function decodeAudio(audioLink, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const buffer = (yield fetch(audioLink)).arrayBuffer();
        return new Audios(yield audioCtx.decodeAudioData(yield buffer), id);
    });
}
function highlightHoveredSinger(ev) {
    const { left, right, top, bottom } = getMovingSongPosition(ev);
    // Highlighting the hovered singer
    global.singers.forEach((singer) => singer.classList.add("active"));
    global.singersPost.forEach((singer) => {
        const isInsideSinger = singer.left < left &&
            right < singer.right &&
            singer.top < top &&
            bottom < singer.bottom;
        if (isInsideSinger) {
            singer.element.style.opacity = "1";
        }
        else if (!singer.element.getAttribute("data-song-id")) {
            singer.element.style.opacity = "0.6";
        }
    });
}
