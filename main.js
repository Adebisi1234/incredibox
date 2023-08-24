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
let songId = "";
let currentAudio = [];
// BUTTONS
buttons.forEach((button) => {
    button.addEventListener("dragstart", (ev) => {
        songId = ev.target.getAttribute("data-song-id");
    });
    button.addEventListener("dragend", (ev) => {
        ev.target.draggable = false;
        ev.target.style.opacity = "0.5";
    });
});
// SINGERS
singers.forEach((singer) => {
    singer.addEventListener("dragenter", (ev) => {
        ev.target.classList.add("active");
    });
    singer.addEventListener("dragleave", (ev) => {
        ev.target.classList.remove("active");
    });
    singer.addEventListener("dragover", (ev) => {
        ev.preventDefault();
    });
    singer.addEventListener("click", (ev) => {
        const id = ev.target.getAttribute("data-song-id");
        id.length > 0 ? handleRemoveAudio(id) : handleAddAudio(id);
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
    console.log(paused);
    paused === null || paused === void 0 ? void 0 : paused.remove();
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
            return "./public/one.ogg";
        case 2:
            return "./public/two.ogg";
        case 3:
            return "./public/three.ogg";
        case 4:
            return "./public/four.ogg";
        case 5:
            return "./public/five.ogg";
        case 6:
            return "./public/six.ogg";
        default:
            return "";
    }
}
function timeOut() {
    setInterval(() => {
        interval += 1;
        interval % 5 === 0 && currentAudio.forEach((audio) => audio.play());
    }, 1000);
}
