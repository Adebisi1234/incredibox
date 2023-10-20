import { pauseSongs, resetSongs, resumeSongs } from "./canvas.js";
import { autoSongs, global } from "./main.js";

// header
const menu = document.getElementsByClassName("menu")[0] as HTMLDivElement;
const transitions = document.querySelectorAll(
  ".head-transition"
) as NodeListOf<HTMLDivElement>;
const closeMenu = document.getElementsByClassName("close")[0] as HTMLDivElement;
const home = document.getElementById("goHome") as HTMLDivElement;
const landingPage = document.getElementById("home") as HTMLDivElement;
const help = document.getElementById("help") as HTMLDivElement;
const switchVersion = document.getElementById("switch") as HTMLDivElement;
const outLinks = [...document.querySelectorAll("a")] as HTMLAnchorElement[];
const homeSwitch = document.getElementById("home-switch") as HTMLDivElement;
const popup = document.getElementById("popup") as HTMLDivElement;
const modal = document.getElementById("modal") as HTMLDivElement;
const pops = [...document.getElementsByClassName("pop")] as HTMLDivElement[];
const reset = document.getElementById("reset") as HTMLDivElement;
const auto = document.getElementById("autoSongs") as HTMLDivElement;
const rotate = document.getElementById("rotate") as HTMLDivElement;
const clock = document.getElementById("clock") as HTMLDivElement;

reset.onclick = resetSongs;
auto.onclick = () => {
  if (rotate.classList.contains("rotate")) {
    autoSongs(true);
    reset.style.pointerEvents = "all";
    rotate.classList.remove("rotate");
  } else {
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
  } else {
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
