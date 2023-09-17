import { GlobalState, Audios, json } from "./classes.js";
import cropImage from "./anime/croppingImage/crop.js";
// Constants
const audioCtx = new AudioContext();
const global = new GlobalState();
// For Stoping Songs
let pointerDownTop: number = 0;
let pointerUpTop: number = 0;
let pointerDownLeft: number = 0;
let pointerUpLeft: number = 0;
// Updating the singers size on DOM load
window.addEventListener("DOMContentLoaded", () => {
  global.setSingers = document.querySelectorAll(".singer");
  cacheFiles(
  global.allAudioLinks,
  global.allVideoLinks,
  global.allSpriteLinks,
  global.allAnimeURl
).then(() => {
  if (global.isReady) {
    (
      document.getElementsByClassName("splashscreen")[0] as HTMLDivElement
    ).style.display = "none";
    global.singers.forEach((singer) => {
      singer.addEventListener("click", handlePauseAudio);
      singer.addEventListener("pointerdown", handleRemoveAudio);
      singer.addEventListener("pointerup", handleRemoveAudio);
    });

    // dragging songs
    global.songs.forEach((song) => {
      song.addEventListener("pointerdown", startSongDrag);
      song.addEventListener("pointerup", startSinging);
    });
  }
});
});
window.addEventListener("resize", () => {
  global.setSingers = document.querySelectorAll(".singer");
});

let currentMovingSong: HTMLDivElement | undefined = undefined;

// CacheFiles and start application function

// Start application

// const stage: HTMLElement = document.querySelector("main")!;

// fetch blog helper function

// Singers main events

// Event handlers

function handlePauseAudio(ev: MouseEvent) {
  const element: HTMLDivElement = getTarget(ev);

  const audioId = element.getAttribute("data-song-id");
  if (!audioId) {
    return;
  } else {
    const audio: Audios = global.getAudiosInDom[+audioId];
    if (audio) {
      const headCanvas = element.querySelector(".head-canvas") as HTMLCanvasElement;
      const bodyCanvas = element.querySelector(".body-canvas") as HTMLCanvasElement;
      audio.muteSound(element);
    }
  }
}

function startSongDrag(ev: PointerEvent): void {
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
  modifyBodyEvents("add");
  // singers.forEach((singer) => {
  //   singer.addEventListener("pointerover", handleSingerPointerOver);
  //   singer.addEventListener("pointerleave", handleSingerPointerLeave);
  // });
}

function startSinging(ev: PointerEvent): void {
  if (currentMovingSong) {
    const { left, right, top, bottom } = getMovingSongPosition(ev);
    global.singersPost.forEach((singer) => {
      const isInsideSinger =
        singer.left < left &&
        right < singer.right &&
        singer.top < top &&
        bottom < singer.bottom;
      if (isInsideSinger) {
        const id = currentMovingSong!.getAttribute("data-song-id")!;
        isSingerSinging(true, singer.element, id);
        const headCanvas: HTMLCanvasElement = singer.element.querySelector(".head-canvas")!
        const bodyCanvas: HTMLCanvasElement = singer.element.querySelector(".body-canvas")!

        addAudio(id, headCanvas, bodyCanvas);
        currentMovingSong!.style.transform = `translate3d(0px, 0px, 0px)`;
        currentMovingSong = undefined;
      }
    });
    removeMovingSongStyles(currentMovingSong);
  }
  modifyBodyEvents("remove");
  // stage.removeEventListener("pointerover", handleStagePointerMove);
  // singers.forEach((singer) => {
  //   // singer.removeEventListener("pointerover", handleSingerPointerOver);
  //   singer.removeEventListener("pointerleave", handleSingerPointerLeave);
  // });
}

// Main stage
// function handleStagePointerMove(ev: PointerEvent): void {
//
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

function handleRemoveAudio(ev: PointerEvent): void {
  const target = getTarget(ev);
  const id = target.getAttribute("data-song-id");
  const singerId = target.getAttribute("data-singer-id");
  if (!id || !singerId) {
    return;
  }

  if (ev.type === "pointerdown") {
    pointerDownTop = ev.clientY;
    pointerDownLeft = ev.clientX;
  } else if (ev.type === "pointerup") {
    pointerUpTop = ev.clientY;
    pointerUpLeft = ev.clientX;
  }
  if (
    pointerDownTop !== 0 &&
    pointerUpTop !== 0 &&
    pointerDownLeft !== 0 &&
    pointerUpLeft !== 0 &&
    pointerUpTop - pointerDownTop > 20 &&
    pointerUpLeft - pointerDownLeft < 20
  ) {
    stopSong(id, target);
    pointerUpTop = 0;
    pointerDownTop = 0;
    pointerUpLeft = 0;
    pointerDownLeft = 0;
  }
}

// customizing the singers

// Playing video

// adding & Playing audio

function addAudio(id: string, headCanvas: HTMLCanvasElement, bodyCanvas: HTMLCanvasElement) {
  const newAudio = global.allCachedAudios[+id];
  if (Object.keys(global.getAudiosInDom).length === 0) {
    global.setAudiosInDom = { id: +id, audio: newAudio };
    newAudio.play();
    
    
    startBeatInterval();
  } else {
    global.setAudioQueue = newAudio;
    if (Object.keys(global.getAudiosInDom).length >= 2) {
      isWinningCombination();
    } else {
      global.videoPlayer.forEach((video) => video.classList.remove("playable"));
    }
  }
}

function handlePlayVideo(ev: MouseEvent) {
  // This can also be better
  const videoId = (ev.target as HTMLDivElement).getAttribute("data-player-id")!;
  console.log(videoId);
  for (const audio in global.getAudiosInDom) {
    if (Object.prototype.hasOwnProperty.call(global.getAudiosInDom, audio)) {
      const audioId = global.getAudiosInDom[audio].id;
      const element: HTMLDivElement = document.querySelector(
        `.singer[data-song-id="${audioId}"]`
      )!;
      
      global.getAudiosInDom[audio].muteSound(element);
    }
  }
  const video = document.querySelector("video");
  if (video) {
    video.src = global.allCachedVideoURL[+videoId];
    video.addEventListener("ended", handleVideoPlayer);
    video.classList.add("video-playing");
    video.play();
  }
  function handleVideoPlayer() {
    if (video) {
      video.classList.remove("video-playing");
      video.src = "";
      video.removeEventListener("ended", handleVideoPlayer);
    }
  }
}

// Beat && loader
function startBeatInterval() {
  global.beatIntervalId = setInterval(() => {
    global.counter += 1;
    if (global.counter % global.beat === 0) {
      global.getAudioQueue.forEach((audio, i) => {
        global.setAudiosInDom = { id: +audio.id, audio };
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

function handleMovingSong(ev: PointerEvent): void {
  if (currentMovingSong) {
    movingSongStyles(ev, currentMovingSong);
    highlightHoveredSinger(ev);

    // Implement moving eyes
  }
}

// Helper functions

async function cacheFiles(
  allAudioLinks: {
    [key: number]: string;
  },
  allVideoLinks: {
    [key: number]: string;
  },
  allSpriteLinks: {
    [key: number]: string;
  },
  allAnimeLinks: {
    [key: number]: string;
  },
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
    for (const animeLink in allAnimeLinks) {
      const animeJSON = await fetchJson(allAnimeLinks[animeLink]);
      global.anime[animeLink] = animeJSON;
    }
    global.isLoading = false;
  } catch (err) {
    console.log(err)
  }
}

function getMovingSongPosition(ev: PointerEvent) {
  const position: { left: number; top: number; right: number; bottom: number } =
    { left: 0, top: 0, right: 0, bottom: 0 };
  position.left = ev.clientX;
  position.right = position.left + currentMovingSong!.offsetWidth / 2; // taking Translate(-50%, -50%) above into account
  position.top = ev.clientY;
  position.bottom = position.top + currentMovingSong!.offsetHeight / 2; // taking Translate(-50%, -50%) above into account
  return position;
}
function isSingerSinging(
  isSinging: boolean,
  singer: HTMLDivElement,
  id: string
) {
  const singerId = singer.getAttribute("data-singer-id");
  const loader = singer.lastElementChild! as HTMLDivElement;
  if (isSinging) {
    Object.keys(global.getAudiosInDom).length !== 0 &&
      global.counter % global.beat !== 0 &&
      loader.classList.add("loading");
    singer.style.opacity = "1";
    singer.setAttribute(
      "data-song-id",
      currentMovingSong!.getAttribute("data-song-id")!
    );
    singer.classList.add("singing");
    // Create hd version for stand by
    // document.documentElement.style.setProperty(
    //   `--background-${singerId}`,
    //   `url("${global.allCachedStaticSpriteURL[+id]}")`
    // );
    document.documentElement.style.setProperty(
      "--transition-time",
      `${global.counter % global.beat}s`
    );
  } else {
    singer.classList.remove("singing");
    singer.style.opacity = "0.6";
    singer.removeAttribute("data-song-id");
    loader.classList.remove("loading");
    (
      document.querySelector(`.song[data-song-id='${id}']`) as HTMLDivElement
    ).style.opacity = "1";
    (
      document.querySelector(`.song[data-song-id='${id}']`) as HTMLDivElement
    ).style.backgroundPositionY = `0`;
    document.documentElement.style.setProperty(
      `--background-${singerId}`,
      `url('/singer.png')`
    );
  }
}
function modifyBodyEvents(type: "add" | "remove") {
  if (type === "add") {
    document.body.addEventListener("pointermove", handleMovingSong);
    document.body.addEventListener("pointercancel", startSinging);
    document.body.addEventListener("pointerup", startSinging);
  } else if (type === "remove") {
    document.body.removeEventListener("pointermove", handleMovingSong);
    document.body.removeEventListener("pointercancel", startSinging);
    document.body.removeEventListener("pointerup", startSinging);
  }
}

function movingSongStyles(ev: PointerEvent, currentMovingSong: HTMLDivElement) {
  const x = ev.clientX - currentMovingSong.offsetLeft;
  const y = ev.clientY - currentMovingSong.offsetTop;
  currentMovingSong.style.transform = `translate3d(${x % innerWidth}px, ${y % innerHeight
    }px, 10px) translate(-50%, -50%) `;
  currentMovingSong.style.backgroundPositionY = "100%";
}
function removeMovingSongStyles(currentMovingSong: HTMLDivElement | undefined) {
  if (currentMovingSong) {
    currentMovingSong.style.transform = `translate3d(0px, 0px, 0px)`;
    currentMovingSong.style.backgroundPositionY = "0";
    currentMovingSong = undefined;
    global.singers.forEach((singer) => singer.classList.remove("active"));
  }
}
function stopSong(id: string, target: HTMLDivElement) {
  isSingerSinging(false, target, id);
  global.removeAudioFromQueue = id;
  if (global.getAudiosInDom[+id]) {
    global.removeAudioFromDom = +id;
  }
  if (Object.keys(global.getAudiosInDom).length === 0) {
    document.documentElement.style.setProperty("--transition-time", "0s")
  }
}

function isWinningCombination() {
  // There has to be a better way than this
  for (const combination in global.winningCombination) {
    if (
      Object.prototype.hasOwnProperty.call(
        global.winningCombination,
        combination
      )
    ) {
      const win: boolean = global.winningCombination[combination].every(
        (songId) => {
          return global.getAudiosInDom[songId] || global.getAudioQueue[songId];
        }
      );
      if (win) {
        global.videoPlayer.forEach((player) => {
          if (player.getAttribute("data-player-id") === combination) {
            player.classList.add("playable");
            player.nextElementSibling?.classList.add("loading");
            player.addEventListener("click", handlePlayVideo);
          }
        });
      } else {
        global.videoPlayer.forEach((player) => {
          if (player.getAttribute("data-player-id") === combination) {
            player.classList.remove("playable");
            player.nextElementSibling?.classList.add("loading");
            player.removeEventListener("click", handlePlayVideo);
          }
        });
      }
    }
  }
}

async function fetchBlob(link: string): Promise<Blob> {
  try {
    const response = await (await fetch(link)).blob();
    return response;
  } catch (err) {
    throw new Error("Invalid URL");
  }
}
async function fetchJson(link: string): Promise<json> {
  try {
    const response = await (await fetch(link)).json();
    return response;
  } catch (err) {
    throw new Error("Invalid URL");
  }
}

// Gotta make this better
function getTarget(ev: Event) {
  if ((ev.target as HTMLDivElement).classList.contains("frame")) {
    return (ev.target as HTMLDivElement).parentElement as HTMLDivElement;
  } else if ((ev.target as HTMLDivElement).classList.contains("body")) {
    return (ev.target as HTMLDivElement).parentElement!
      .parentElement as HTMLDivElement;
  } else if ((ev.target as HTMLDivElement).classList.contains("body-canvas")) {
    return (ev.target as HTMLDivElement).parentElement!.parentElement!
      .parentElement as HTMLDivElement;
  } else if ((ev.target as HTMLDivElement).classList.contains("head")) {
    return (ev.target as HTMLDivElement).parentElement!.parentElement!
      .parentElement as HTMLDivElement;
  } else if ((ev.target as HTMLDivElement).classList.contains("head-canvas")) {
    return (ev.target as HTMLDivElement).parentElement!.parentElement!
      .parentElement!.parentElement as HTMLDivElement;
  }
  return ev.target as HTMLDivElement;
}

async function decodeAudio(audioLink: string, id: string) {
  const buffer = (await fetch(audioLink)).arrayBuffer();
  return new Audios(await audioCtx.decodeAudioData(await buffer), id);
}

function highlightHoveredSinger(ev: PointerEvent) {
  const { left, right, top, bottom } = getMovingSongPosition(ev);
  // Highlighting the hovered singer
  global.singers.forEach((singer) => singer.classList.add("active"));
  global.singersPost.forEach((singer) => {
    const isInsideSinger =
      singer.left < left &&
      right < singer.right &&
      singer.top < top &&
      bottom < singer.bottom;
    if (isInsideSinger) {
      singer.element.style.opacity = "1";
    } else if (!singer.element.getAttribute("data-song-id")) {
      singer.element.style.opacity = "0.6";
    }
  });
}
