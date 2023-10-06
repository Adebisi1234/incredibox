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
const homeSwitch = document.getElementById("home-switch") as HTMLDivElement;
const popup = document.getElementById("popup") as HTMLDivElement;
const modal = document.getElementById("modal") as HTMLDivElement;
const pops = [...document.getElementsByClassName("pop")] as HTMLDivElement[];
const versionSwitch = () => {
  popup.classList.remove("with-tab");
  pops.forEach((pop) => pop.classList.remove("active"));
  if (!modal.classList.contains("animateFadeIn")) {
    modal.classList.add("animateFadeIn");
    pops[3].classList.add("active");
  }
};
menu.onclick = () => {
  transitions.forEach((header) => header.classList.add("tright"));
};

closeMenu.onclick = () => {
  transitions.forEach((header) => header.classList.remove("tright"));
};

home.onclick = () => {
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

export {};
