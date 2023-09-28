"use strict";
// header
const menu = document.getElementsByClassName("menu")[0];
const headLeft = document.getElementsByClassName("head-left")[0];
const closeMenu = document.getElementsByClassName("close")[0];
const home = document.getElementsByClassName("home")[0];
const landingPage = document.getElementsByClassName("versions")[0];
menu.onclick = () => {
    headLeft.classList.add("tright");
};
closeMenu.onclick = () => {
    headLeft.classList.remove("tright");
};
home.onclick = () => {
    console.log(home);
    landingPage.classList.remove("hidden");
};
