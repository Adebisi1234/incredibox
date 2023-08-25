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
let interval: number = 0;
let intervalId: number = 0;
let songId: string = "";
let currentAudio: HTMLAudioElement[] = [];

// BUTTONS
buttons.forEach((button) => {
  button.addEventListener("dragstart", (ev: DragEvent) => {
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
  singer.addEventListener("pointermove", () => {});
  singer.addEventListener("pointerdown", () => {});
  singer.addEventListener("pointerup", () => {});
  singer.addEventListener("pointerleave", () => {});
  singer.addEventListener("dragleave", (ev: DragEvent) => {
    (ev.target as HTMLDivElement).classList.remove("active");
  });
  singer.addEventListener("dragover", (ev: DragEvent) => {
    ev.preventDefault();
  });
  singer.addEventListener("click", (ev: MouseEvent) => {
    const id = (ev.target as HTMLDivElement).getAttribute("data-song-id")!;
    id && document.querySelector(`audio[data-song-id='${id}']`)
      ? handleRemoveAudio(id!)
      : handleAddAudio(id);
  });
  singer.addEventListener("drop", (ev: DragEvent) => {
    ev.preventDefault();
    (ev.target as HTMLDivElement).setAttribute("data-song-id", songId);
    (ev.target as HTMLDivElement).classList.replace("active", "end");
    handleAddAudio(songId);
  });
});

function handleRemoveAudio(id: string) {
  const paused: HTMLAudioElement = document.querySelector(
    `audio[data-song-id='${id}']`
  )!;
  paused.pause();
  paused.src = "";
  paused.remove();

  if (!document.getElementsByTagName("audio").length) {
    timeOut(true);
  }
}

function handleAddAudio(id: string) {
  const audio: HTMLAudioElement = document.createElement("audio");
  audio.preload = "auto";
  audio.loop = true;
  audio.src = getAudioURl(id);
  audio.setAttribute("data-song-id", id);
  audio.addEventListener("ended", (ev: Event) => {
    let src = (ev.target as HTMLAudioElement).src;
    src.endsWith("_a.ogg")
      ? (src = src.replace("_a.ogg", "_b.ogg"))
      : (src = src.replace("_b.ogg", "_a.ogg"));
    console.log(src);
    (ev.target as HTMLAudioElement).play();
  });
  document.body.append(audio);
  currentAudio.push(audio);
  if (document.getElementsByTagName("audio").length === 1) {
    audio.play();
    timeOut();
  }
}

function getAudioURl(id: string) {
  switch (+id) {
    case 1:
      return "./public/1_atlanta_a.ogg";
    case 2:
      return "./public/2_tuctom_a.ogg";
    case 3:
      return "./public/3_foubreak_a.ogg";
    case 4:
      return "./public/4_koukaki_a.ogg";
    case 5:
      return "./public/5_koungou_a.ogg";
    case 6:
      return "./public/6_bass_a.ogg";
    case 7:
      return "./public/7_monk_a.ogg";
    case 8:
      return "./public/8_sonar_a.ogg";
    case 9:
      return "./public/9_souffle_a.ogg";
    case 10:
      return "./public/10_epifle_a.ogg";
    case 11:
      return "./public/11_arpeg_a.ogg";
    case 12:
      return "./public/12_tromp_a.ogg";
    case 13:
      return "./public/13_pizzi_a.ogg";
    case 14:
      return "./public/14_organ_a.ogg";
    case 15:
      return "./public/15_synth_a.ogg";
    case 16:
      return "./public/16_follow_a.ogg";
    case 17:
      return "./public/17_choir_a.ogg";
    case 18:
      return "./public/18_houhou_a.ogg";
    case 19:
      return "./public/19_reach_a.ogg";
    case 20:
      return "./public/20_believe_a.ogg";

    default:
      return "";
  }
}

function timeOut(clear: boolean = false) {
  if (clear) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {
    interval += 1;

    interval % 5 === 0 && currentAudio.forEach((audio) => audio?.play());
  }, 1000);
}
