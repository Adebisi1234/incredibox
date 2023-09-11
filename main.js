var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GlobalState, Audios } from "./classes.js";
// Constants
const audioCtx = new AudioContext();
const global = new GlobalState();
// Updating the singers size on DOM load
window.addEventListener("DOMContentLoaded", () => {
    global.setSingers = document.querySelectorAll(".singer");
});
window.addEventListener("resize", () => {
    global.setSingers = document.querySelectorAll(".singer");
});
let currentMovingSong = undefined;
// const stage: HTMLElement = document.querySelector("main")!;
// fetch blog helper function
// Singers main events
global.singers.forEach((singer) => {
    singer.addEventListener("click", handlePauseAudio);
    singer.addEventListener("pointerdown", handleRemoveAudio);
    singer.addEventListener("pointerup", handleRemoveAudio);
});
// dragging songs
global.songs.forEach((song) => {
    song.addEventListener("pointerdown", handleSongPointerDown);
    song.addEventListener("pointerup", handleDropSong);
});
// Event handlers
function handlePauseAudio(ev) {
    const element = getTarget(ev);
    const audioId = element.getAttribute("data-song-id");
    if (!audioId) {
        return;
    }
    else {
        const audio = global.getAudiosInDom[+audioId];
        if (audio) {
            audio.muteSound(element);
        }
    }
}
function handleSongPointerDown(ev) {
    const container = ev.target.classList.contains("left") ||
        ev.target.classList.contains("right");
    currentMovingSong = container ? undefined : ev.target;
    if (!currentMovingSong ||
        Object.keys(global.getAudiosInDom).includes(currentMovingSong.getAttribute("data-song-id"))) {
        currentMovingSong = undefined;
    }
    // stage.addEventListener("pointerover", handleStagePointerMove);
    document.body.addEventListener("pointermove", handleMovingSong);
    document.body.addEventListener("pointerup", handleDropSong);
    document.body.addEventListener("pointercancel", handleDropSong);
    // singers.forEach((singer) => {
    //   singer.addEventListener("pointerover", handleSingerPointerOver);
    //   singer.addEventListener("pointerleave", handleSingerPointerLeave);
    // });
}
function handleDropSong(ev) {
    if (currentMovingSong) {
        const x = ev.clientX - currentMovingSong.offsetLeft;
        const y = ev.clientY - currentMovingSong.offsetTop;
        const left = currentMovingSong.offsetLeft + x;
        const right = left + currentMovingSong.offsetWidth / 2; // taking Translate(-50%, -50%) above into account
        const top = currentMovingSong.offsetTop + y;
        const bottom = top + currentMovingSong.offsetHeight / 2; // taking Translate(-50%, -50%) above into account
        global.singersPost.forEach((singer) => {
            if (singer.left < left &&
                right < singer.right &&
                singer.top < top &&
                bottom < singer.bottom) {
                const id = currentMovingSong.getAttribute("data-song-id");
                const singerId = singer.element.getAttribute("data-singer-id");
                singer.element.style.opacity = "1";
                singer.element.setAttribute("data-song-id", currentMovingSong.getAttribute("data-song-id"));
                const loader = singer.element.lastElementChild;
                document.documentElement.style.setProperty("--transition-time", `${global.counter % global.beat}s`);
                Object.keys(global.getAudiosInDom).length !== 0 &&
                    loader.classList.add("loading");
                singer.element.classList.add("singing");
                document.documentElement.style.setProperty(`--background-${singerId}`, `url(${global.allCachedSpriteURL[+id]})`);
                addAudio(id);
                currentMovingSong.style.transform = `translate3d(0px, 0px, 0px)`;
                currentMovingSong = undefined;
            }
        });
        if (currentMovingSong) {
            currentMovingSong.style.transform = `translate3d(0px, 0px, 0px)`;
            currentMovingSong.style.opacity = "1";
            currentMovingSong = undefined;
        }
        global.singers.forEach((singer) => singer.classList.remove("active"));
    }
    document.body.removeEventListener("pointermove", handleMovingSong);
    document.body.removeEventListener("pointercancel", handleDropSong);
    document.body.removeEventListener("pointerup", handleDropSong);
    // stage.removeEventListener("pointerover", handleStagePointerMove);
    // singers.forEach((singer) => {
    //   // singer.removeEventListener("pointerover", handleSingerPointerOver);
    //   singer.removeEventListener("pointerleave", handleSingerPointerLeave);
    // });
}
function handleMovingSong(ev) {
    if (currentMovingSong) {
        const x = ev.clientX - currentMovingSong.offsetLeft;
        const y = ev.clientY - currentMovingSong.offsetTop;
        currentMovingSong.style.opacity = "0.7";
        currentMovingSong.style.transformOrigin = "center";
        currentMovingSong.style.transform = `translate3d(${x % innerWidth}px, ${y % innerHeight}px, 10px) translate(-50%, -50%) `;
        const left = currentMovingSong.offsetLeft + x; // = clientX you dumbass :) leaving it for now
        const right = left + currentMovingSong.offsetWidth / 2; // taking Translate(-50%, -50%) above into account
        const top = currentMovingSong.offsetTop + y;
        const bottom = top + currentMovingSong.offsetHeight / 2;
        // Highlighting the hovered singer
        global.singers.forEach((singer) => singer.classList.add("active"));
        global.singersPost.forEach((singer) => {
            if (singer.left < left &&
                right < singer.right &&
                singer.top < top &&
                bottom < singer.bottom) {
                singer.element.style.opacity = "1";
            }
            else if (!singer.element.getAttribute("data-song-id")) {
                singer.element.style.opacity = "0.6";
            }
        });
        // Implement moving eyes
    }
}
// Main stage
// function handleStagePointerMove(ev: PointerEvent): void {
//   console.log(ev);
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
let pointerDownTop = 0;
let pointerUpTop = 0;
function handleRemoveAudio(ev) {
    const target = getTarget(ev);
    const id = target.getAttribute("data-song-id");
    const singerId = target.getAttribute("data-singer-id");
    if (!id || !singerId) {
        return;
    }
    if (ev.type === "pointerdown") {
        pointerDownTop = ev.clientY;
    }
    else if (ev.type === "pointerup") {
        pointerUpTop = ev.clientY;
    }
    if (pointerDownTop !== 0 &&
        pointerUpTop !== 0 &&
        pointerUpTop - pointerDownTop > 20) {
        dropSong(id, target, singerId);
        pointerUpTop = 0;
        pointerDownTop = 0;
    }
}
function dropSong(id, target, singerId) {
    target.classList.remove("singing");
    target.style.opacity = "0.6";
    target.removeAttribute("data-song-id");
    target.lastElementChild.classList.remove("loading");
    document.querySelector(`.song[data-song-id='${id}']`).style.opacity = "1";
    global.removeAudioFromDom = +id;
    document.documentElement.style.setProperty(`--background-${singerId}`, `url('/singer.png')`);
}
// customizing the singers
// Playing video
// adding & Playing audio
function addAudio(id) {
    const newAudio = global.allCachedAudios[+id];
    if (Object.keys(global.getAudiosInDom).length === 0) {
        newAudio.play();
        startBeatInterval();
        global.setAudiosInDom = { id: +id, audio: newAudio };
        isWinningCombination();
    }
    else {
        global.setAudioQueue = newAudio;
        global.setAudiosInDom = { id: +id, audio: newAudio };
        isWinningCombination();
    }
}
const winningCombinations = [{}, {}, {}];
function isWinningCombination() { }
// Beat && loader
function startBeatInterval() {
    global.beatIntervalId = setInterval(() => {
        global.counter += 1;
        if (global.counter % global.beat === 0) {
            global.getAudioQueue.forEach((audio, i) => {
                audio.play();
                document
                    .querySelector(`.singer[data-song-id="${audio.id}"]`)
                    .lastElementChild.classList.remove("loading");
                global.getAudioQueue.splice(i, 1);
            });
        }
    }, global.getInterval);
}
// Muting audio
// Loading indicator animation
// Removing audio & clear interval
// Animations
// CacheFiles and start application function
function cacheFiles(allAudioLinks, allVideoLinks, allSpriteLinks) {
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
                const spriteBlob = yield fetchBlob(allSpriteLinks[spriteLink]);
                global.allCachedSpriteURL[spriteLink] = URL.createObjectURL(spriteBlob);
            }
            global.isLoading = false;
        }
        catch (err) {
            throw new Error();
        }
    });
}
// Start application
cacheFiles(global.allAudioLinks, global.allVideoLinks, global.allSpriteLinks).then(() => {
    if (global.isReady) {
        document.getElementsByClassName("splashscreen")[0].style.display = "none";
    }
});
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
function getTarget(ev) {
    return ev.target.classList.contains("frame")
        ? ev.target.parentElement
        : ev.target;
}
function decodeAudio(audioLink, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const buffer = (yield fetch(audioLink)).arrayBuffer();
        return new Audios(yield audioCtx.decodeAudioData(yield buffer), id);
    });
}
