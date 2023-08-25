"use strict";
/*
Now let see how we'll implement this
We'll have a single invisible audio tag that it src file changes based on user interaction

All the audio files will be located in the /public folder, on later implementation they will be fetched lazily optimizing the website

We'll have a function for each small features and there'll be event listener on every single piece of the app from the buttons to the singers

**Singers**
* The container element will have an onDragEnter **event listener(event)** on it - which moves the eyes of the singers toward the moved button
* Each singer will have an onDrop event on it - Which triggers the changeSrcOfAudio function that controls the song and a class will be added that shows it's active

** Buttons**
* The button will be draggable, and the singers will be it's only active drop point, it'll return to it's original position otherwise
* Each button will have an id that identifies the song it represent

MORE TO Come
*/
const singers = document.querySelectorAll(".singer");
const buttons = document.querySelectorAll(".button");
let interval = 0;
let intervalId = 0;
let songId = "";
let currentAudio = [];
// BUTTONS
buttons.forEach((button) => {
    button.addEventListener("dragstart", (ev) => {
        songId = ev.target.getAttribute("data-song-id");
    });
    button.addEventListener("dragend", (ev) => {
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
        ev.preventDefault();
        ev.target.setAttribute("data-song-id", songId);
        ev.target.classList.replace("active", "end");
        handleAddAudio(songId);
    });
});
function handleRemoveAudio(id) {
    const paused = document.querySelector(`audio[data-song-id='${id}']`);
    paused.pause();
    paused.src = "";
    paused.remove();
    if (!document.getElementsByTagName("audio").length) {
        timeOut(true);
    }
}
function handleAddAudio(id) {
    const audio = document.createElement("audio");
    audio.preload = "auto";
    audio.loop = true;
    audio.src = getAudioURl(id);
    audio.setAttribute("data-song-id", id);
    document.body.append(audio);
    currentAudio.push(audio);
    if (document.getElementsByTagName("audio").length === 1) {
        audio.play();
        timeOut();
    }
}
function getAudioURl(id) {
    switch (+id) {
        case 1:
            return "./public/1_atlanta_a.ogg";
        case 2:
            return "./public/2_tuctom_a.ogg";
        case 3:
            return "./public/3_foubreak_a.ogg";
        case 4:
            return "./public/4_koukaki_a.ogg";
        case 5:
            return "./public/5_koungou_a.ogg";
        case 6:
            return "./public/6_bass_a.ogg";
        case 7:
            return "./public/7_monk_a.ogg";
        case 8:
            return "./public/8_sonar_a.ogg";
        case 9:
            return "./public/9_souffle_a.ogg";
        case 10:
            return "./public/10_epifle_a.ogg";
        case 11:
            return "./public/11_arpeg_a.ogg";
        case 12:
            return "./public/12_tromp_a.ogg";
        case 13:
            return "./public/13_pizzi_a.ogg";
        case 14:
            return "./public/14_organ_a.ogg";
        case 15:
            return "./public/15_synth_a.ogg";
        case 16:
            return "./public/16_follow_a.ogg";
        case 17:
            return "./public/17_choir_a.ogg";
        case 18:
            return "./public/18_houhou_a.ogg";
        case 19:
            return "./public/19_reach_a.ogg";
        case 20:
            return "./public/20_believe_a.ogg";
        default:
            return "";
    }
}
function timeOut(clear = false) {
    if (clear) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(() => {
        interval += 1;
        interval % 5 === 0 &&
            (() => {
                // let audios: NodeListOf<HTMLAudioElement> =
                //   document.querySelectorAll("audio");
                // audios.forEach((audio) => {
                //   let src: string = audio.src;
                //   src.endsWith("_a.ogg")
                //     ? (src = src.replace("_a.ogg", "_b.ogg"))
                //     : (src = src.replace("_b.ogg", "_a.ogg"));
                //   audio.src = src;
                //   console.log(audio.src);
                //   audio.play();
                // });
                currentAudio.forEach((audio) => audio === null || audio === void 0 ? void 0 : audio.play());
            })();
    }, 1000);
}
