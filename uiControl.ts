// header
const menu = document.getElementsByClassName("menu")[0] as HTMLDivElement;
const headLeft = document.getElementsByClassName(
  "head-left"
)[0] as HTMLDivElement;
const closeMenu = document.getElementsByClassName("close")[0] as HTMLDivElement;
const home = document.getElementsByClassName("home")[0] as HTMLDivElement;
const landingPage = document.getElementsByClassName(
  "versions"
)[0] as HTMLDivElement;
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
