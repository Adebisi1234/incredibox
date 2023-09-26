"use strict";
const orient = document.getElementById("orient");
const orientationControl = orient.parentElement;
orient.addEventListener("click", () => {
    // @ts-ignore
    // screen.orientation.lock("landscape")
    console.log(`The orientation of the screen is: ${screen.orientation.type}`);
    // orientationControl.style.display = "none";
});
// @ts-expect-error
screen.addEventListener("orientationchange", () => {
});
