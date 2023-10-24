"use strict";
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.documentElement.classList.add("darkmode");
}
const info = document.getElementById("info");
const settings = document.getElementById("settings");
const theme = document.getElementById("theme");
const modal = document.getElementById("modal");
const tabButtons = [
    ...document.getElementsByClassName("tab-button"),
];
const pops = [...document.getElementsByClassName("pop")];
const navl = document.getElementById("navl");
const navr = document.getElementById("navr");
let progress = 0;
const prog = [...document.getElementsByClassName("prog")];
const slide = document.getElementById("slide");
const popup = document.getElementById("popup");
const fullscreen = document.getElementById("fullscreen");
fullscreen.onclick = () => {
    if (screen.height === innerHeight) {
        document.exitFullscreen();
    }
    else {
        document.body.requestFullscreen();
    }
};
window.addEventListener("load", () => {
    if (!screen.orientation.type.includes("portrait")) {
        pops.forEach((pop) => pop.classList.remove("active"));
        pops[4].classList.add("active");
    }
});
screen.orientation.addEventListener("change", () => {
    if (!screen.orientation.type.includes("portrait")) {
        pops.forEach((pop) => pop.classList.remove("active"));
        pops[4].classList.add("active");
    }
});
navl.onclick = moveSlideLeft;
navr.onclick = moveSlideRight;
function moveSlideRight() {
    navl.classList.remove("disable");
    progress = ++progress % 5;
    if (progress <= 0) {
        navl.classList.add("disable");
        progress = 0;
    }
    prog.forEach((element, i) => {
        if (i === progress) {
            element.classList.add("active");
        }
        else {
            element.classList.remove("active");
        }
    });
    slide.style.transform = `translate(-${progress * 20}%, 0%)`;
}
function moveSlideLeft() {
    if (!(progress <= 0)) {
        progress = --progress % 5;
    }
    else {
        navl.classList.add("disable");
        progress = 0;
    }
    prog.forEach((element, i) => {
        if (i === progress) {
            element.classList.add("active");
        }
        else {
            element.classList.remove("active");
        }
    });
    slide.style.transform = `translate(${progress * 20}%, 0%)`;
}
info.onclick = () => {
    pops.forEach((pop) => pop.classList.remove("active"));
    if (!modal.classList.contains("animateFadeIn")) {
        modal.classList.add("animateFadeIn");
        popup.classList.add("with-tab");
        tabButtons[0].classList.add("active");
        pops[0].classList.add("active");
    }
};
``;
theme.onclick = () => {
    document.documentElement.classList.toggle("darkmode");
    if (document.documentElement.classList.contains("darkmode")) {
        localStorage.setItem("theme", "dark");
    }
    else {
        localStorage.setItem("theme", "light");
    }
};
tabButtons.forEach((tabButton) => {
    tabButton.onclick = (ev) => {
        const target = ev.target;
        tabButtons.forEach((tab, i) => {
            if (tab.id === target.id ||
                (target.parentElement.classList.contains("tab-button") &&
                    tab.id === target.parentElement.id)) {
                tab.classList.add("active");
                pops[i].classList.add("active");
            }
            else {
                tab.classList.remove("active");
                pops[i].classList.remove("active");
            }
        });
    };
});
modal.onclick = (ev) => {
    if (ev.target.id === "modal") {
        modal.classList.remove("animateFadeIn");
        pops.forEach((pop) => pop.classList.remove("active"));
    }
};
