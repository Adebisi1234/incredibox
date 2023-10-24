const title = document.getElementById("title") as HTMLDivElement;
const pump = document.getElementById("pump") as HTMLDivElement;
const experience = document.getElementById("experience") as HTMLDivElement;
const headphone = document.getElementById("headphone") as HTMLDivElement;
const choose = document.getElementById("choose") as HTMLDivElement;
const versions = [...document.querySelectorAll(".version")];
const settingsElem = document.getElementById("settings") as HTMLDivElement;

window.onload = () => {
  if (screen.orientation.type.includes("landscape")) {
    introAnim();
  }
};

window.addEventListener("orientationchange", () => {
  if (screen.orientation.type.includes("landscape")) {
    introAnim();
  }
});

function introAnim() {
  if (title.classList.contains("titleUp")) {
    return;
  }
  setTimeout(() => {
    title.classList.add("titleUp");
    pump.classList.add("pumpUpHide");
    experience.classList.add("experienceUp");
    headphone.classList.add("headphoneUp");
    choose.classList.add("chooseUp");
  }, 2500);
  setTimeout(() => {
    title.classList.add("titleUpHide");
    experience.classList.add("experienceUpHide");
    headphone.classList.add("headphoneUpHide");
    settingsElem.classList.add("experienceUp");
    versions.forEach((version, i) => {
      setTimeout(() => {
        version.classList.add("versionUp");
      }, i * 50);
    });
  }, 5000);
}
