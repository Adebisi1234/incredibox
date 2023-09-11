import { GlobalState, Audios } from "./classes.js";
// Constants
const audioCtx = new AudioContext();
const global = new GlobalState();

// Updating the singers size on DOM load
window.addEventListener("DOMContentLoaded", () => {
  global.setSingers = document.querySelectorAll(".singer");
});
window.addEventListener("resize", () => {
  global.setSingers = document.querySelectorAll(".singer");
});

let currentMovingSong: HTMLDivElement | undefined = undefined;
// const stage: HTMLElement = document.querySelector("main")!;

// fetch blog helper function

// Singers main events
global.singers.forEach((singer) => {
  singer.addEventListener("click", handlePauseAudio);
  singer.addEventListener("pointerdown", handleRemoveAudio);
  singer.addEventListener("pointerup", handleRemoveAudio);
});

// dragging songs
global.songs.forEach((song) => {
  song.addEventListener("pointerdown", handleSongPointerDown);
  song.addEventListener("pointerup", handleDropSong);
});

// Event handlers

function handlePauseAudio(ev: MouseEvent) {
  const element: HTMLDivElement = getTarget(ev);

  const audioId = element.getAttribute("data-song-id");
  if (!audioId) {
    return;
  } else {
    const audio: Audios = global.getAudiosInDom[+audioId];
    if (audio) {
      audio.muteSound(element);
    }
  }
}

function handleSongPointerDown(ev: PointerEvent): void {
  const container =
    (ev.target as HTMLDivElement).classList.contains("left") ||
    (ev.target as HTMLDivElement).classList.contains("right");
  currentMovingSong = container ? undefined : (ev.target as HTMLDivElement);
  if (
    !currentMovingSong ||
    Object.keys(global.getAudiosInDom).includes(
      currentMovingSong.getAttribute("data-song-id")!
    )
  ) {
    currentMovingSong = undefined;
  }
  // stage.addEventListener("pointerover", handleStagePointerMove);
  document.body.addEventListener("pointermove", handleMovingSong);
  document.body.addEventListener("pointerup", handleDropSong);
  document.body.addEventListener("pointercancel", handleDropSong);
  // singers.forEach((singer) => {
  //   singer.addEventListener("pointerover", handleSingerPointerOver);
  //   singer.addEventListener("pointerleave", handleSingerPointerLeave);
  // });
}
function handleDropSong(ev: PointerEvent): void {
  if (currentMovingSong) {
    const x = ev.clientX - currentMovingSong.offsetLeft;
    const y = ev.clientY - currentMovingSong.offsetTop;
    const left = currentMovingSong.offsetLeft + x;
    const right = left + currentMovingSong.offsetWidth / 2; // taking Translate(-50%, -50%) above into account
    const top = currentMovingSong.offsetTop + y;
    const bottom = top + currentMovingSong.offsetHeight / 2; // taking Translate(-50%, -50%) above into account
    global.singersPost.forEach((singer) => {
      if (
        singer.left < left &&
        right < singer.right &&
        singer.top < top &&
        bottom < singer.bottom
      ) {
        const id = currentMovingSong!.getAttribute("data-song-id")!;
        const singerId = singer.element.getAttribute("data-singer-id");
        singer.element.style.opacity = "1";
        singer.element.setAttribute(
          "data-song-id",
          currentMovingSong!.getAttribute("data-song-id")!
        );
        const loader = singer.element.lastElementChild! as HTMLDivElement;
        document.documentElement.style.setProperty(
          "--transition-time",
          `${global.counter % global.beat}s`
        );
        Object.keys(global.getAudiosInDom).length !== 0 &&
          loader.classList.add("loading");
        singer.element.classList.add("singing");
        document.documentElement.style.setProperty(
          `--background-${singerId}`,
          `url(${global.allCachedSpriteURL[+id]})`
        );
        addAudio(id);
        currentMovingSong!.style.transform = `translate3d(0px, 0px, 0px)`;
        currentMovingSong = undefined;
      }
    });
    if (currentMovingSong) {
      currentMovingSong!.style.transform = `translate3d(0px, 0px, 0px)`;
      currentMovingSong.style.opacity = "1";
      currentMovingSong = undefined;
    }
    global.singers.forEach((singer) => singer.classList.remove("active"));
  }
  document.body.removeEventListener("pointermove", handleMovingSong);
  document.body.removeEventListener("pointercancel", handleDropSong);
  document.body.removeEventListener("pointerup", handleDropSong);
  // stage.removeEventListener("pointerover", handleStagePointerMove);
  // singers.forEach((singer) => {
  //   // singer.removeEventListener("pointerover", handleSingerPointerOver);
  //   singer.removeEventListener("pointerleave", handleSingerPointerLeave);
  // });
}
function handleMovingSong(ev: PointerEvent): void {
  if (currentMovingSong) {
    const x = ev.clientX - currentMovingSong.offsetLeft;
    const y = ev.clientY - currentMovingSong.offsetTop;

    currentMovingSong.style.opacity = "0.7";
    currentMovingSong.style.transformOrigin = "center";
    currentMovingSong.style.transform = `translate3d(${x % innerWidth}px, ${
      y % innerHeight
    }px, 10px) translate(-50%, -50%) `;
    const left = currentMovingSong.offsetLeft + x; // = clientX you dumbass :) leaving it for now
    const right = left + currentMovingSong.offsetWidth / 2; // taking Translate(-50%, -50%) above into account
    const top = currentMovingSong.offsetTop + y;
    const bottom = top + currentMovingSong.offsetHeight / 2;
    // Highlighting the hovered singer
    global.singers.forEach((singer) => singer.classList.add("active"));
    global.singersPost.forEach((singer) => {
      if (
        singer.left < left &&
        right < singer.right &&
        singer.top < top &&
        bottom < singer.bottom
      ) {
        singer.element.style.opacity = "1";
      } else if (!singer.element.getAttribute("data-song-id")) {
        singer.element.style.opacity = "0.6";
      }
    });
    // Implement moving eyes
  }
}
// Main stage
// function handleStagePointerMove(ev: PointerEvent): void {
//   console.log(ev);
//   if (
//     currentMovingSong &&
//     ((ev.target as HTMLDivElement).classList.contains("frame") ||
//       (ev.target as HTMLDivElement).classList.contains("singers"))
//   ) {
//     console.log("enter singer");
//     (ev.target as HTMLDivElement).classList.add("entered");
//   }
// }
// Singers
// function handleSingerPointerOver(ev: PointerEvent): void {
//   //
// }
// function handleSingerPointerLeave(ev: PointerEvent): void {
//   // console.log("singer pointer leave");
// }
let pointerDownTop: number = 0;
let pointerUpTop: number = 0;
function handleRemoveAudio(ev: PointerEvent): void {
  const target = getTarget(ev);
  const id = target.getAttribute("data-song-id");
  const singerId = target.getAttribute("data-singer-id");
  if (!id || !singerId) {
    return;
  }

  if (ev.type === "pointerdown") {
    pointerDownTop = ev.clientY;
  } else if (ev.type === "pointerup") {
    pointerUpTop = ev.clientY;
  }
  if (
    pointerDownTop !== 0 &&
    pointerUpTop !== 0 &&
    pointerUpTop - pointerDownTop > 20
  ) {
    dropSong(id, target, singerId);
    pointerUpTop = 0;
    pointerDownTop = 0;
  }
}

function dropSong(id: string, target: HTMLDivElement, singerId: string) {
  target.classList.remove("singing");
  target.style.opacity = "0.6";
  target.removeAttribute("data-song-id");
  target.lastElementChild!.classList.remove("loading");
  (
    document.querySelector(`.song[data-song-id='${id}']`) as HTMLDivElement
  ).style.opacity = "1";
  global.removeAudioFromDom = +id;
  document.documentElement.style.setProperty(
    `--background-${singerId}`,
    `url('/singer.png')`
  );
}

// customizing the singers

// Playing video

// adding & Playing audio

function addAudio(id: string) {
  const newAudio = global.allCachedAudios[+id];
  if (Object.keys(global.getAudiosInDom).length === 0) {
    newAudio.play();
    startBeatInterval();
    global.setAudiosInDom = { id: +id, audio: newAudio };
    isWinningCombination();
  } else {
    global.setAudioQueue = newAudio;
    global.setAudiosInDom = { id: +id, audio: newAudio };
    isWinningCombination();
  }
}

const winningCombinations = [{}, {}, {}];

function isWinningCombination() {}

// Beat && loader
function startBeatInterval() {
  global.beatIntervalId = setInterval(() => {
    global.counter += 1;
    if (global.counter % global.beat === 0) {
      global.getAudioQueue.forEach((audio, i) => {
        audio.play();
        document
          .querySelector(`.singer[data-song-id="${audio.id}"]`)!
          .lastElementChild!.classList.remove("loading");
        global.getAudioQueue.splice(i, 1);
      });
    }
  }, global.getInterval);
}

// Muting audio

// Loading indicator animation

// Removing audio & clear interval

// Animations

// CacheFiles and start application function

async function cacheFiles(
  allAudioLinks: {
    [key: number]: string;
  },
  allVideoLinks: {
    [key: number]: string;
  },
  allSpriteLinks: {
    [key: number]: string;
  }
) {
  try {
    for (const audioLink in allAudioLinks) {
      global.allCachedAudios[audioLink] = await decodeAudio(
        allAudioLinks[audioLink],
        audioLink
      );
    }
    for (const videoLink in allVideoLinks) {
      const videoBlob = await fetchBlob(allVideoLinks[videoLink]);
      global.allCachedVideoURL[videoLink] = URL.createObjectURL(videoBlob);
    }
    for (const spriteLink in allSpriteLinks) {
      const spriteBlob = await fetchBlob(allSpriteLinks[spriteLink]);
      global.allCachedSpriteURL[spriteLink] = URL.createObjectURL(spriteBlob);
    }
    global.isLoading = false;
  } catch (err) {
    throw new Error();
  }
}

// Start application
cacheFiles(
  global.allAudioLinks,
  global.allVideoLinks,
  global.allSpriteLinks
).then(() => {
  if (global.isReady) {
    (
      document.getElementsByClassName("splashscreen")[0] as HTMLDivElement
    ).style.display = "none";
  }
});

async function fetchBlob(link: string): Promise<Blob> {
  try {
    const response = await (await fetch(link)).blob();
    return response;
  } catch (err) {
    throw new Error("Invalid URL");
  }
}

function getTarget(ev: Event) {
  return (ev.target as HTMLDivElement).classList.contains("frame")
    ? ((ev.target as HTMLDivElement).parentElement as HTMLDivElement)
    : (ev.target as HTMLDivElement);
}

async function decodeAudio(audioLink: string, id: string) {
  const buffer = (await fetch(audioLink)).arrayBuffer();
  return new Audios(await audioCtx.decodeAudioData(await buffer), id);
}
