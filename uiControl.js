import { pauseSongs, resetSongs, resumeSongs } from "./canvas.js";
import { autoSongs, global } from "./main.js";
// header
const menu = document.getElementsByClassName("menu")[0];
const transitions = document.querySelectorAll(".head-transition");
const closeMenu = document.getElementsByClassName("close")[0];
const home = document.getElementById("goHome");
const landingPage = document.getElementById("home");
const help = document.getElementById("help");
const switchVersion = document.getElementById("switch");
const outLinks = [...document.querySelectorAll("a")];
const homeSwitch = document.getElementById("home-switch");
const popup = document.getElementById("popup");
const modal = document.getElementById("modal");
const pops = [...document.getElementsByClassName("pop")];
const reset = document.getElementById("reset");
const auto = document.getElementById("autoSongs");
const rotate = document.getElementById("rotate");
const clock = document.getElementById("clock");
reset.onclick = resetSongs;
auto.onclick = () => {
    if (rotate.classList.contains("rotate")) {
        autoSongs(true);
        reset.style.pointerEvents = "all";
        rotate.classList.remove("rotate");
    }
    else {
        autoSongs();
        reset.style.pointerEvents = "none";
        rotate.classList.add("rotate");
    }
};
clock.onclick = () => {
    clock.classList.toggle("paused");
    if (clock.classList.contains("paused")) {
        global.allSongs.forEach((song) => song.classList.add("disable"));
        pauseSongs();
    }
    else {
        global.allSongs.forEach((song) => song.classList.remove("disable"));
        resumeSongs();
    }
};
const versionSwitch = () => {
    popup.classList.remove("with-tab");
    pops.forEach((pop) => pop.classList.remove("active"));
    if (!modal.classList.contains("animateFadeIn")) {
        modal.classList.add("animateFadeIn");
        pops[3].classList.add("active");
    }
};
export const firstTime = () => {
    popup.classList.remove("with-tab");
    pops.forEach((pop) => pop.classList.remove("active"));
    if (!modal.classList.contains("animateFadeIn")) {
        modal.classList.add("animateFadeIn");
        pops[0].classList.add("active");
    }
    localStorage.setItem("firsttime", "false");
};
menu.onclick = () => {
    transitions.forEach((header) => header.classList.add("tright"));
};
closeMenu.onclick = () => {
    transitions.forEach((header) => header.classList.remove("tright"));
};
home.onclick = () => {
    autoSongs(true);
    resetSongs();
    landingPage.classList.remove("hidden");
};
help.onclick = () => {
    popup.classList.remove("with-tab");
    pops.forEach((pop) => pop.classList.remove("active"));
    if (!modal.classList.contains("animateFadeIn")) {
        modal.classList.add("animateFadeIn");
        pops[0].classList.add("active");
    }
};
switchVersion.onclick = versionSwitch;
homeSwitch.onclick = versionSwitch;
outLinks.forEach((version) => version.addEventListener("click", resetSongs));
