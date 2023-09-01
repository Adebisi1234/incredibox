"use strict";
/*
Now let see how we'll implement this

All the audio files will be located in the /public folder, on later implementation they will be fetched lazily optimizing the website

We'll have a function for each small features and there'll be event listener on every single piece of the app from the songs to the singers

**Singers**
* The container element will have an onDragEnter **event listener(event)** on it - which moves the eyes of the singers toward the moved song
* Each singer will have an onDrop event on it - Which triggers the changeSrcOfAudio function that controls the song and a class will be added that shows it's active

** songs**
* The song will be draggable, and the singers will be it's only active drop point, it'll return to it's original position otherwise
* Each song will have an id that identifies the song it represent

MORE TO Come
*/
const singers = document.querySelectorAll(".singer");
const songs = document.querySelectorAll(".song");
let beat = 0;
let intervalId = 0;
let songId = "";
let currentAudios = [];
// songs
songs.forEach((song) => {
    song.addEventListener("dragstart", (ev) => {
        songId = ev.target.getAttribute("data-song-id");
    });
    song.addEventListener("dragend", (ev) => {
        var _a;
        if (((_a = ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.dropEffect) === "copy") {
            ev.target.draggable = false;
            ev.target.style.opacity = "0.5";
        }
    });
});
// SINGERS
singers.forEach((singer) => {
    singer.addEventListener("dragenter", (ev) => {
        ev.target.classList.add("active");
    });
    // singer.addEventListener("pointermove", () => {});
    // singer.addEventListener("pointerdown", () => {});
    // singer.addEventListener("pointerup", () => {});
    // singer.addEventListener("pointerleave", (ev: PointerEvent) => {
    //   const id = (ev.target as HTMLDivElement).getAttribute("data-song-id")!;
    //   id && document.querySelector(`audio[data-song-id='${id}']`)
    //     && handleRemoveAudio(id!)
    // });
    singer.addEventListener("dragleave", (ev) => {
        ev.target.classList.remove("active");
    });
    singer.addEventListener("dragover", (ev) => {
        ev.preventDefault();
    });
    singer.addEventListener("click", (ev) => {
        const id = ev.target.getAttribute("data-song-id");
        const audio = document.querySelector(`audio[data-song-id='${id}']`);
        audio.muted = !audio.muted;
    });
    singer.addEventListener("drop", (ev) => {
        var _a;
        ev.preventDefault();
        ev.target.setAttribute("data-song-id", songId);
        (_a = ev.target.lastElementChild) === null || _a === void 0 ? void 0 : _a.setAttribute("data-song-id", songId);
        ev.target.classList.replace("active", "end");
        handleAddAudio(songId);
    });
});
function handleRemoveAudio(id) {
    const audioToRemove = document.querySelector(`audio[data-song-id='${id}']`);
    audioToRemove.pause();
    audioToRemove.src = "";
    audioToRemove.remove();
    if (!document.getElementsByTagName("audio").length) {
        beatInterval(true);
    }
}
function handleAddAudio(id) {
    var _a;
    const audio = document.createElement("audio");
    audio.preload = "auto";
    audio.loop = true;
    audio.src = getAudioURl(id);
    audio.setAttribute("data-song-id", id);
    // Loader slider unsteady
    id !== "1" &&
        ((_a = document
            .querySelector(`.loader[data-song-id='${id}']`)) === null || _a === void 0 ? void 0 : _a.classList.add("loading"));
    document.documentElement.style.setProperty("--transition-time", `${beat % 5}s`);
    document.body.append(audio);
    currentAudios.push(audio);
    if (document.getElementsByTagName("audio").length === 1) {
        audio.play();
        beatInterval();
    }
}
function getAudioURl(id) {
    switch (+id) {
        case 1:
            return "./public/1_atlanta.ogg";
        case 2:
            return "./public/2_tuctom.ogg";
        case 3:
            return "./public/3_foubreak.ogg";
        case 4:
            return "./public/4_koukaki.ogg";
        case 5:
            return "./public/5_koungou.ogg";
        case 6:
            return "./public/6_bass.ogg";
        case 7:
            return "./public/7_monk.ogg";
        case 8:
            return "./public/8_sonar.ogg";
        case 9:
            return "./public/9_souffle.ogg";
        case 10:
            return "./public/10_epifle.ogg";
        case 11:
            return "./public/11_arpeg.ogg";
        case 12:
            return "./public/12_tromp.ogg";
        case 13:
            return "./public/13_pizzi.ogg";
        case 14:
            return "./public/14_organ.ogg";
        case 15:
            return "./public/15_synth.ogg";
        case 16:
            return "./public/16_follow.ogg";
        case 17:
            return "./public/17_choir.ogg";
        case 18:
            return "./public/18_houhou.ogg";
        case 19:
            return "./public/19_reach.ogg";
        case 20:
            return "./public/20_believe.ogg";
        default:
            return "";
    }
}
function beatInterval(clear = false) {
    if (clear) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(() => {
        beat += 1;
        beat % 5 === 0 &&
            currentAudios.forEach((audio, i) => {
                var _a;
                (audio === null || audio === void 0 ? void 0 : audio.paused) && (audio === null || audio === void 0 ? void 0 : audio.play());
                const id = audio.getAttribute("data-song-id");
                document.documentElement.style.setProperty("--transition-time", `0s`);
                (_a = document
                    .querySelector(`.loader[data-song-id='${id}']`)) === null || _a === void 0 ? void 0 : _a.classList.remove("loading");
            });
    }, 1000);
}
