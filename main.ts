/* 
Now let see how we'll implement this
We'll have a single invisible audio tag that it src file changes based on user interaction

All the audio files will be located in the /public folder, on later implementation they will be fetched lazily optimizing the website

We'll have a function for each small features and there'll be event listener on every single piece of the app from the buttons to the singers

**Singers**
* The container element will have an onDragEnter **event listener(event)** on it - which moves the eyes of the singers toward the moved button
* Each singer will have an onDrop event on it - Which triggers the changeSrcOfAudio function that controls the song and a class will be added that shows it's active

** Buttons**
* The button will be draggable, and the singers will be it's only active drop point, it'll return to it's original position otherwise
* Each button will have an id that identifies the song it represent

MORE TO Come
*/
const singers: NodeListOf<HTMLDivElement> =
  document.querySelectorAll(".singer");
const buttons: NodeListOf<HTMLDivElement> =
  document.querySelectorAll(".button");
let num: number = 0;
let interval: number = 0;

// BUTTONS
buttons.forEach((button) => {
  button.addEventListener("dragstart", (ev: DragEvent) => {
    console.log(ev);
    console.log((ev.target as HTMLAudioElement).getAttribute("data-song-id")!);
    songId = (ev.target as HTMLAudioElement).getAttribute("data-song-id")!;
  });
  button.addEventListener("dragend", (ev: DragEvent) => {
    (ev.target as HTMLAudioElement).draggable = false;
    (ev.target as HTMLAudioElement).style.opacity = "0.5";
  });
});

// SINGERS
singers.forEach((singer: HTMLDivElement): void => {
  singer.addEventListener("dragenter", (ev: DragEvent) => {
    (ev.target as HTMLDivElement).classList.add("active");
  });
  singer.addEventListener("dragleave", (ev: DragEvent) => {
    (ev.target as HTMLDivElement).classList.remove("active");
  });
  singer.addEventListener("dragover", (ev: DragEvent) => {
    ev.preventDefault();
  });
  singer.addEventListener("click", (ev: MouseEvent) => {
    const id = (ev.target as HTMLDivElement).getAttribute("data-song-id");
    handleRemoveAudio(id!);
  });
  singer.addEventListener("drop", (ev: DragEvent) => {
    ev.preventDefault();
    (ev.target as HTMLDivElement).setAttribute("data-song-id", songId);
    (ev.target as HTMLDivElement).classList.replace("active", "end");
    num++;
    handleAudio(num);
  });
});
let currentAudio: HTMLAudioElement | undefined = undefined;
let songId = "";
function handleRemoveAudio(id: string) {
  const paused = document.querySelector(`audio[data-song-id='${id}']`);
  paused?.remove();
}

function handleAudio(num: number) {
  const audio: HTMLAudioElement = document.createElement("audio");
  audio.preload = "auto";
  audio.loop = true;
  audio.src = getAudioURl(num);
  audio.setAttribute("data-song-id", songId);
  document.body.append(audio);
  currentAudio = audio;
  if (document.getElementsByTagName("audio").length === 1) {
    audio.play();
    timeOut();
  }
}

function getAudioURl(num: number) {
  switch (num) {
    case 1:
      return "./public/one.ogg";
    case 2:
      return "./public/two.ogg";
    case 3:
      return "./public/three.ogg";
    case 4:
      return "./public/four.ogg";
    case 5:
      return "./public/five.ogg";
    case 6:
      return "./public/six.ogg";
    default:
      return "";
  }
}

function timeOut() {
  setInterval(() => {
    interval += 1;

    interval % 5 === 0 && currentAudio?.play();
  }, 1000);
}
