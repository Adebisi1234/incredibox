const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("darkmode");
}

const info = document.getElementById("info") as HTMLDivElement;
const settings = document.getElementById("settings") as HTMLDivElement;
const theme = document.getElementById("theme") as HTMLDivElement;
const modal = document.getElementById("modal") as HTMLDivElement;
const tabButtons = [
  ...document.getElementsByClassName("tab-button"),
] as HTMLDivElement[];
const pops = [...document.getElementsByClassName("pop")] as HTMLDivElement[];
const navl = document.getElementById("navl") as HTMLDivElement;
const navr = document.getElementById("navr") as HTMLDivElement;
let progress = 0;
const prog = [...document.getElementsByClassName("prog")] as HTMLDivElement[];
const slide = document.getElementById("slide") as HTMLDivElement;
const popup = document.getElementById("popup") as HTMLDivElement;
const fullscreen = document.getElementById("fullscreen") as HTMLDivElement;
const orientationPop = document.getElementById("orientation") as HTMLDivElement;


fullscreen.onclick = () => {
  document.body.requestFullscreen();     orientationPop.classList.remove("active");
};

window.addEventListener("load", () => {
  if (screen.orientation.type.includes("portrait")) {
    orientationPop.classList.add("active");
  }
  if (!(screen.height === innerHeight)) {
    orientationPop.classList.add("active");
  }
});
screen.orientation.addEventListener("change", () => {
  if (screen.orientation.type.includes("landscape")) {
    orientationPop.classList.remove("active");
  } else {
    orientationPop.classList.add("active");
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
    } else {
      element.classList.remove("active");
    }
  });
  slide.style.transform = `translate(-${progress * 20}%, 0%)`;
  console.log(progress);
}
function moveSlideLeft() {
  console.log("fuck");
  if (!(progress <= 0)) {
    progress = --progress % 5;
  } else {
    navl.classList.add("disable");
    progress = 0;
  }
  prog.forEach((element, i) => {
    if (i === progress) {
      element.classList.add("active");
    } else {
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
  } else {
    localStorage.setItem("theme", "light");
  }
};
tabButtons.forEach((tabButton) => {
  tabButton.onclick = (ev: MouseEvent) => {
    const target = ev.target as HTMLDivElement;
    tabButtons.forEach((tab, i) => {
      console.log(ev.target);
      if (
        tab.id === target.id ||
        (target.parentElement!.classList.contains("tab-button") &&
          tab.id === target.parentElement!.id)
      ) {
        tab.classList.add("active");
        pops[i].classList.add("active");
      } else {
        tab.classList.remove("active");
        pops[i].classList.remove("active");
      }
    });
  };
});

modal.onclick = (ev: MouseEvent) => {
  if ((ev.target as HTMLDivElement).id === "modal") {
    modal.classList.remove("animateFadeIn");
    pops.forEach((pop) => pop.classList.remove("active"));
  }
};
