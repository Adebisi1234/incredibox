const orient = document.getElementById("orient") as HTMLButtonElement
const orientationControl = orient.parentElement! as HTMLDivElement
orient.addEventListener("click", () => {
    // @ts-expect-error
    screen.orientation.lock("landscape")
    localStorage.setItem("orientation", "landscape")
    orientationControl.style.display = "none";
})
// @ts-expect-error
screen.addEventListener("orientationchange", () => {
  if(screen.orientation.type.includes("landscape")) {
    orientationControl.style.display = "none";
  }
});