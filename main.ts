import { animate, isSongInPosition } from "./canvas.js";
import { Audios, GlobalState, prop } from "./classes.js";
export const global: GlobalState = new GlobalState();
const appLoader = document.getElementById("app-loader") as HTMLDivElement;
const appLoaderStatus = document.getElementById(
  "app-loader-status"
) as HTMLDivElement;
const playButton = document.getElementById("play-icon") as HTMLDivElement;
const playLoader = document.getElementById("play-loader") as HTMLDivElement;
let throttle: number = 0;
window.onload = () => {
  if (
    !location.href.slice(-3).includes("v=") ||
    +location.href.slice(-1) > 9 ||
    +location.href.slice(-1) < 1 ||
    isNaN(+location.href.slice(-1))
  ) {
    // handle error
    console.log("Error");
  } else {
    global.setVersion = +location.href.slice(-1);
    // Set beat based on version
    startApplication(global.version);
    document.documentElement.style.setProperty(
      "--col",
      `var(--colV${location.href.slice(-1)})`
    );
    document.documentElement.classList.add(`v${location.href.slice(-1)}`);
    global.allSingers = [
      ...(document.querySelectorAll(".singer") as NodeListOf<HTMLDivElement>),
    ];
    global.allSongs = [
      ...(document.querySelectorAll(".song") as NodeListOf<HTMLDivElement>),
    ];
  }
};

const handleMovingSong = (ev: PointerEvent) => {
  throttle++;
  if (throttle % 5 === 0) {
    if (global.currentMovingSong) {
      const x = ev.clientX - global.currentMovingSong.offsetLeft;
      const y = ev.clientY - global.currentMovingSong.offsetTop;
      global.currentMovingSong.style.transform = `translate3d(${
        x % innerWidth
      }px, ${y % innerHeight}px, 10px) translate(-50%, -50%) `;
    } else return;
  }
};
const handleReturnSong = (ev: PointerEvent) => {
  console.log("handleReturnSong", global.currentMovingSong);
  if (global.currentMovingSong) {
    const { left, right, top, bottom } = getMovingSongPosition(ev);
    const singerId: number = isSongInPosition(left, right, top, bottom);
    console.log(singerId);
    if (singerId !== 0 && typeof singerId === "number") {
      const audioId = global.currentMovingSong.getAttribute("data-song-id");
      if (audioId) {
        addAudio(singerId, +audioId);
      } else console.log("audioId error");
    }
    global.currentMovingSong.style.transform = `translate3d(0,0,0) translate(0,0) `;
    global.currentMovingSong = undefined;
  } else return;
};

const addAudio = (singerId: number, audioId: number) => {
  const newAudio = { audio: global.allAudios[audioId], singerId };
  global.audioQueue.push(newAudio);
  if (Object.keys(global.audiosInDom).length === 0) {
    console.log("Start");
    startBeatInterval();
  }
};

const startBeatInterval = (clear: boolean = false) => {
  let i = 0;
  console.log("starting interval");
  const audioObj = global.audioQueue.pop();
  global.audiosInDom[audioObj!.audio.id] = audioObj!.audio;
  animate(audioObj!.singerId, +audioObj!.audio?.id);
  if (clear) {
    clearInterval(global.beatIntervalId);
  }
  global.beatIntervalId = setInterval(() => {
    i += 100;
    if (i % global.beat === 0) {
      addAudioToDom();
    }
  }, 100);
};

const addAudioToDom = () => {
  for (let i = 0; i < global.audioQueue.length; i++) {
    const audioObj = global.audioQueue[i];
    global.audiosInDom[audioObj!.audio.id] = audioObj!.audio;
    animate(audioObj!.singerId, +audioObj!.audio?.id);
  }
};
// // I PITY WHOEVER GOES THROUGH THIS CODE
// import { GlobalState, Audios, json, oldJson } from "./classes.js";
// // Constants

// const global = new GlobalState();
// // For Stopping Songs
// let pointerDownTop: number = 0;
// let pointerUpTop: number = 0;
// let pointerDownLeft: number = 0;
// let pointerUpLeft: number = 0;
// // Updating the singers size on DOM load
// window.addEventListener("DOMContentLoaded", () => {
//   global.setSingers = document.querySelectorAll(".singer");
//   cacheFiles(
//     global.allAudioLinks,
//     global.allVideoLinks,
//     global.allSpriteLinks,
//     global.allStaticSpriteLinks,
//     global.allAnimeURl
//   )
//     .then(() => {
//       if (global.isReady) {
//         (
//           document.getElementsByClassName("splashscreen")[0] as HTMLDivElement
//         ).style.display = "none";
//         global.singers.forEach((singer) => {
//           singer.addEventListener("click", handlePauseAudio);
//           singer.addEventListener("pointerdown", handleRemoveAudio);
//           singer.addEventListener("pointerup", handleRemoveAudio);
//         });

//         // dragging songs
//         global.songs.forEach((song) => {
//           song.addEventListener("pointerdown", startSongDrag);
//           song.addEventListener("pointerup", startSinging);
//         });
//       }
//     })
//     .catch((err) => (document.body.textContent = `An error occurred ${err}`));
// });
// window.addEventListener("resize", () => {
//   global.setSingers = document.querySelectorAll(".singer");
// });

// let currentMovingSong: HTMLDivElement | undefined = undefined;

// // CacheFiles and start application function

// // Start application

// // const stage: HTMLElement = document.querySelector("main")!;

// // fetch blog helper function

// // Singers main events

// // Event handlers

// function handlePauseAudio(ev: MouseEvent) {
//   const element: HTMLDivElement = getSinger(ev);

//   const audioId = element.getAttribute("data-song-id");
//   if (!audioId) {
//     return;
//   } else {
//     const audio: Audios = global.getAudiosInDom[+audioId];
//     if (audio) {
//       const headCanvas = element.querySelector(
//         ".head-canvas"
//       ) as HTMLCanvasElement;
//       const bodyCanvas = element.querySelector(
//         ".body-canvas"
//       ) as HTMLCanvasElement;
//       if (element.style.opacity === "1") {
//         document.documentElement.style.setProperty(
//           `--background-${element.getAttribute("data-singer-id")}`,
//           `url("${global.allCachedStaticSpriteURL[+audioId]}")`
//         );
//         global.pauseAnimation(audioId, headCanvas, bodyCanvas);
//       } else {
//         global.animate(audioId, headCanvas, bodyCanvas);
//       }
//       audio.muteSound(element);
//     }
//   }
// }

// function startSongDrag(ev: PointerEvent): void {
//   const container =
//     (ev.target as HTMLDivElement).classList.contains("left") ||
//     (ev.target as HTMLDivElement).classList.contains("right");
//   currentMovingSong = container ? undefined : (ev.target as HTMLDivElement);
//   if (
//     !currentMovingSong ||
//     Object.keys(global.getAudiosInDom).includes(
//       currentMovingSong.getAttribute("data-song-id")!
//     )
//   ) {
//     currentMovingSong = undefined;
//   }
//   // stage.addEventListener("pointerover", handleStagePointerMove);
//   modifyBodyEvents("add");
//   // singers.forEach((singer) => {
//   //   singer.addEventListener("pointerover", handleSingerPointerOver);
//   //   singer.addEventListener("pointerleave", handleSingerPointerLeave);
//   // });
// }

// function startSinging(ev: PointerEvent): void {
//   if (currentMovingSong) {
//     const { left, right, top, bottom } = getMovingSongPosition(ev);
//     global.singersPost.forEach((singer) => {
//       const isInsideSinger =
//         singer.left < left &&
//         right < singer.right &&
//         singer.top < top &&
//         bottom < singer.bottom;
//       if (isInsideSinger) {
//         const id = currentMovingSong!.getAttribute("data-song-id")!;
//         isSingerSinging(true, singer.element, id);
//         const headCanvas: HTMLCanvasElement =
//           singer.element.querySelector(".head-canvas")!;
//         const bodyCanvas: HTMLCanvasElement =
//           singer.element.querySelector(".body-canvas")!;
//         addAudio(id, headCanvas, bodyCanvas);
//         currentMovingSong!.style.transform = `translate3d(0px, 0px, 0px)`;
//         currentMovingSong = undefined;
//       }
//     });
//     removeMovingSongStyles(currentMovingSong);
//   }
//   modifyBodyEvents("remove");
//   // stage.removeEventListener("pointerover", handleStagePointerMove);
//   // singers.forEach((singer) => {
//   //   // singer.removeEventListener("pointerover", handleSingerPointerOver);
//   //   singer.removeEventListener("pointerleave", handleSingerPointerLeave);
//   // });
// }

// // Main stage
// // function handleStagePointerMove(ev: PointerEvent): void {
// //
// //   if (
// //     currentMovingSong &&
// //     ((ev.target as HTMLDivElement).classList.contains("frame") ||
// //       (ev.target as HTMLDivElement).classList.contains("singers"))
// //   ) {
// //     console.log("enter singer");
// //     (ev.target as HTMLDivElement).classList.add("entered");
// //   }
// // }
// // Singers
// // function handleSingerPointerOver(ev: PointerEvent): void {
// //   //
// // }
// // function handleSingerPointerLeave(ev: PointerEvent): void {
// //   // console.log("singer pointer leave");
// // }

// function handleRemoveAudio(ev: PointerEvent): void {
//   const target = getSinger(ev);
//   const audioId = target.getAttribute("data-song-id");
//   const singerId = target.getAttribute("data-singer-id");
//   if (!audioId || !singerId) {
//     return;
//   }

//   if (ev.type === "pointerdown") {
//     pointerDownTop = ev.clientY;
//     pointerDownLeft = ev.clientX;
//   } else if (ev.type === "pointerup") {
//     pointerUpTop = ev.clientY;
//     pointerUpLeft = ev.clientX;
//   }
//   if (
//     pointerDownTop !== 0 &&
//     pointerUpTop !== 0 &&
//     pointerDownLeft !== 0 &&
//     pointerUpLeft !== 0 &&
//     pointerUpTop - pointerDownTop > 20 &&
//     pointerUpLeft - pointerDownLeft < 20
//   ) {
//     stopSong(audioId, singerId, target);
//     pointerUpTop = 0;
//     pointerDownTop = 0;
//     pointerUpLeft = 0;
//     pointerDownLeft = 0;
//   }
// }

// // customizing the singers

// // Playing video

// // adding & Playing audio

// function addAudio(
//   id: string,
//   headCanvas: HTMLCanvasElement,
//   bodyCanvas: HTMLCanvasElement
// ) {
//   const newAudio = global.allCachedAudios[+id];
//   global.setAudioQueue = { audio: newAudio, headCanvas, bodyCanvas };
//   if (Object.keys(global.getAudiosInDom).length === 0) {
//     startBeatInterval();
//   }
//   isWinningCombination();
// }

// function handlePlayVideo(target: HTMLVideoElement) {
//   // This can also be better
//   const video = target;
//   const audioId = `2${video.id}`;
//   if (video) {
//     video.src = global.allCachedVideoURL[+video.id];
//     video.addEventListener("ended", handleStopVideo);
//     video.parentElement!.style.height = "100vh";
//     video.parentElement!.style.width = "100vw";
//     const videoPlayer = document.querySelector(
//       `.video-player[data-player-id="${video.id}"]`
//     ) as HTMLDivElement;
//     videoPlayer.lastElementChild!.classList.remove("loading");
//     videoPlayer.style.pointerEvents = "all";
//     setTimeout(() => {
//       video.play();
//       global.allCachedAudios[audioId].play();
//     }, 250);
//   }
//   for (const audio in global.getAudiosInDom) {
//     if (Object.prototype.hasOwnProperty.call(global.getAudiosInDom, audio)) {
//       const audioId = global.getAudiosInDom[audio].id;
//       const element: HTMLDivElement = document.querySelector(
//         `.singer[data-song-id="${audioId}"]`
//       )!;

//       global.getAudiosInDom[audio].muteSound(element, true);
//     }
//   }
//   for (const audioObj in global.getAudioQueue) {
//     if (Object.prototype.hasOwnProperty.call(global.getAudioQueue, audioObj)) {
//       const audioId = global.getAudiosInDom[audioObj].id;
//       const element: HTMLDivElement = document.querySelector(
//         `.singer[data-song-id="${audioId}"]`
//       )!;

//       global.getAudioQueue[audioObj].audio.muteSound(element, true);
//     }
//   }
//   function handleStopVideo() {
//     if (video) {
//       video.parentElement!.style.height = "0vh";
//       global.allCachedAudios[audioId].stop();
//       global.setVideoInQueue = undefined;
//       for (const audio in global.getAudiosInDom) {
//         if (
//           Object.prototype.hasOwnProperty.call(global.getAudiosInDom, audio)
//         ) {
//           const audioId = global.getAudiosInDom[audio].id;
//           const element: HTMLDivElement = document.querySelector(
//             `.singer[data-song-id="${audioId}"]`
//           )!;

//           global.getAudiosInDom[audio].muteSound(element);
//         }
//       }
//     }
//   }
// }

// // Beat && loader
// function startBeatInterval(clear?: boolean) {
//   if (clear) {
//     clearInterval(global.beatIntervalId);
//   }

//   if (global.getAudioQueue.length === 1) {
//     const audioObj = global.getAudioQueue[0];
//     audioObj.audio.play();
//     global.setAudiosInDom = { id: +audioObj.audio.id, audio: audioObj.audio };
//     global.animate(audioObj.audio.id, audioObj.headCanvas, audioObj.bodyCanvas);
//   }
//   global.beatIntervalId = setInterval(() => {
//     global.counter += 1;
//     document.documentElement.style.setProperty(
//       "--transition-time",
//       `${global.counter % global.beat}s`
//     );
//     if (global.counter % global.beat === 0) {
//       global.getAudioQueue.forEach((audioObj, i) => {
//         if (!global.getAudiosInDom[audioObj.audio.id]) {
//           global.setAudiosInDom = {
//             id: +audioObj.audio.id,
//             audio: audioObj.audio,
//           };
//           global.animate(
//             audioObj.audio.id,
//             audioObj.headCanvas,
//             audioObj.bodyCanvas
//           );
//           audioObj.audio.play();
//           document
//             .querySelector(`.singer[data-song-id="${audioObj.audio.id}"]`)!
//             .lastElementChild!.classList.remove("loading");
//         }
//         global.getAudioQueue.splice(i, 1);
//       });
//     }
//   }, global.getInterval);
// }

// // Muting audio

// // Loading indicator animation

// // Removing audio & clear interval

// // Animations

// function handleMovingSong(ev: PointerEvent): void {
//   if (currentMovingSong) {
//     movingSongStyles(ev, currentMovingSong);
//     highlightHoveredSinger(ev);

//     // Implement moving eyes

//   }
// }

// // Helper functions

// async function cacheFiles(
//   allAudioLinks: {
//     [key: number]: string;
//   },
//   allVideoLinks: {
//     [key: number]: string;
//   },
//   allSpriteLinks: {
//     [key: number]: string;
//   },
//   allStaticSpriteLinks: {
//     [key: number]: string;
//   },
//   allAnimeLinks: {
//     [key: number]: string;
//   }
// ) {
//   try {
//     for (const audioLink in allAudioLinks) {
//       global.allCachedAudios[audioLink] = await decodeAudio(
//         allAudioLinks[audioLink],
//         audioLink
//       );
//     }
//     for (const videoLink in allVideoLinks) {
//       const videoBlob = await fetchBlob(allVideoLinks[videoLink]);
//       global.allCachedVideoURL[videoLink] = URL.createObjectURL(videoBlob);
//     }
//     for (const spriteLink in allSpriteLinks) {
//       global.allCachedSpriteURL[spriteLink] = await fetchBlob(
//         allSpriteLinks[spriteLink]
//       );
//     }
//     for (const staticSpriteLink in allStaticSpriteLinks) {
//       const staticSpriteBlob = await fetchBlob(
//         allStaticSpriteLinks[staticSpriteLink]
//       );
//       global.allCachedStaticSpriteURL[staticSpriteLink] =
//         URL.createObjectURL(staticSpriteBlob);
//     }
//     for (const animeLink in allAnimeLinks) {
//       const animeJSON = await fetchJson(allAnimeLinks[animeLink]);
//       global.anime[animeLink] = animeJSON;
//     }
//     global.isLoading = false;
//   } catch (err) {
//     console.log(err);
//   }
// }

function getMovingSongPosition(ev: PointerEvent) {
  const position: { left: number; top: number; right: number; bottom: number } =
    { left: 0, top: 0, right: 0, bottom: 0 };
  position.left = ev.clientX;
  position.right = position.left + global.currentMovingSong!.offsetWidth / 2; // taking Translate(-50%, -50%) above into account
  position.top = ev.clientY;
  position.bottom = position.top + global.currentMovingSong!.offsetHeight / 2; // taking Translate(-50%, -50%) above into account
  return position;
}
// function isSingerSinging(
//   isSinging: boolean,
//   singer: HTMLDivElement,
//   id: string
// ) {
//   const singerId = singer.getAttribute("data-singer-id");
//   const loader = singer.lastElementChild! as HTMLDivElement;
//   if (isSinging) {
//     Object.keys(global.getAudiosInDom).length !== 0 &&
//       global.counter % global.beat !== 0 &&
//       loader.classList.add("loading");
//     singer.style.opacity = "1";
//     singer.setAttribute("data-song-id", id);
//     singer.classList.add("singing");
//     document.documentElement.style.setProperty(
//       `--background-${singerId}`,
//       `url("${global.allCachedStaticSpriteURL[+id]}")`
//     );
//   } else {
//     singer.classList.remove("singing");
//     singer.style.opacity = "0.6";
//     singer.removeAttribute("data-song-id");
//     loader.classList.remove("loading");
//     (
//       document.querySelector(`.song[data-song-id='${id}']`) as HTMLDivElement
//     ).style.opacity = "1";
//     (
//       document.querySelector(`.song[data-song-id='${id}']`) as HTMLDivElement
//     ).style.backgroundPositionY = `0`;
//     document.documentElement.style.setProperty(
//       `--background-${singerId}`,
//       `url("/public/singer.png")`
//     );
//   }
// }
// function modifyBodyEvents(type: "add" | "remove") {
//   if (type === "add") {
//     document.body.addEventListener("pointermove", handleMovingSong);
//     document.body.addEventListener("pointercancel", startSinging);
//     document.body.addEventListener("pointerup", startSinging);
//   } else if (type === "remove") {
//     document.body.removeEventListener("pointermove", handleMovingSong);
//     document.body.removeEventListener("pointercancel", startSinging);
//     document.body.removeEventListener("pointerup", startSinging);
//   }
// }

// function movingSongStyles(ev: PointerEvent, currentMovingSong: HTMLDivElement) {
//   const x = ev.clientX - currentMovingSong.offsetLeft;
//   const y = ev.clientY - currentMovingSong.offsetTop;
//   currentMovingSong.style.transform = `translate3d(${x % innerWidth}px, ${
//     y % innerHeight
//   }px, 10px) translate(-50%, -50%) `;
//   currentMovingSong.style.backgroundPositionY = "100%";
//   currentMovingSong.style.boxShadow = "3px 3px #555";
// }
// function removeMovingSongStyles(currentMovingSong: HTMLDivElement | undefined) {
//   if (currentMovingSong) {
//     currentMovingSong.style.transform = `translate3d(0px, 0px, 0px)`;
//     currentMovingSong.style.backgroundPositionY = "0";
//     currentMovingSong.style.boxShadow = "0px 0px";
//     currentMovingSong = undefined;
//     global.singers.forEach((singer) => singer.classList.remove("active"));
//   }
// }
// function stopSong(audioId: string, singerId: string, target: HTMLDivElement) {
//   const headCanvas = target.querySelector(".head-canvas") as HTMLCanvasElement;
//   const bodyCanvas = target.querySelector(".body-canvas") as HTMLCanvasElement;
//   document.documentElement.style.setProperty(
//     `background-${singerId}`,
//     "/public/singer.png"
//   );
//   global.clearAnimation(audioId, headCanvas, bodyCanvas);
//   isSingerSinging(false, target, audioId);
//   global.removeAudioFromQueue = audioId;
//   if (global.getAudiosInDom[+audioId]) {
//     global.removeAudioFromDom = +audioId;
//   }
//   if (Object.keys(global.getAudiosInDom).length === 0) {
//     document.documentElement.style.setProperty("--transition-time", "0s");
//     startBeatInterval(true);
//   }
//   isLosingCombination(audioId);
// }
// function gettingCold(videoPlayerId: string) {
//   const videoPlayer = document.querySelector(
//     `.video-player[data-player-id="${videoPlayerId}"]`
//   );
//   switch (true) {
//     case videoPlayer?.classList.contains("combo3"):
//       videoPlayer?.classList.remove("combo3");
//       return;
//     case videoPlayer?.classList.contains("combo2"):
//       videoPlayer?.classList.remove("combo2");
//       return;
//     case videoPlayer?.classList.contains("combo1"):
//       videoPlayer?.classList.remove("combo1");
//       return;
//   }
// }

// function isLosingCombination(audioId: string) {
//   for (const id in global.win) {
//     if (Object.prototype.hasOwnProperty.call(global.win, id)) {
//       let index = global.win[id].indexOf(audioId);
//       let length = global.win[id].length;
//       if (index !== -1) {
//         global.win[id].splice(index, 1);
//       }
//       console.log(global.win[id].length, length);
//       if (global.win[id].length < length) {
//         gettingCold(id);
//         const player = document.querySelector(
//           `.video-player[data-player-id="${id}"`
//         ) as HTMLDivElement;

//         player.removeEventListener("click", makeVideoPlayable);
//       }
//     }
//   }
// }

// function isWinningCombination() {
//   // There has to be a better way than this
//   for (let i = 0; i < global.winningCombination.length; i++) {
//     let combo = global.winningCombination[i].split(",");
//     combo.forEach((audioId) => {
//       if (
//         global.getAudioQueue[global.getAudioQueue.length - 1]?.audio?.id ===
//         audioId
//       ) {
//         global.win[i + 1].push(audioId);
//         gettingHot(`${i + 1}`);
//       }
//     });
//     if (global.win[i + 1].length === 3) {
//       const player = document.querySelector(
//         `.video-player[data-player-id="${i + 1}"]`
//       ) as HTMLDivElement;
//       player.classList.add("playable");
//       player.addEventListener("click", makeVideoPlayable);
//     }
//   }
// }
// function makeVideoPlayable(ev: MouseEvent) {
//   const video = document.getElementsByTagName("video")[0] as HTMLVideoElement;
//   video.id = (ev.target as HTMLDivElement).id;
//   (ev.target as HTMLDivElement).style.pointerEvents = "none";
//   (ev.target as HTMLDivElement).lastElementChild!.classList.add("loading");
//   console.log("are we here");
//   setTimeout(() => {
//     handlePlayVideo(video);
//   }, (global.counter % global.beat) * 1000);
//   global.setVideoInQueue = video;
// }

// function gettingHot(videoPlayerId: string) {
//   const videoPlayer = document.querySelector(
//     `.video-player[data-player-id="${videoPlayerId}"]`
//   );

//   switch (true) {
//     case videoPlayer?.classList.contains("combo2"):
//       videoPlayer?.classList.add("combo3");
//       return;

//     case videoPlayer?.classList.contains("combo1"):
//       videoPlayer?.classList.add("combo2");
//       return;

//     default:
//       videoPlayer!.classList.add("combo1");
//       return;
//   }

//   // Use another function entirely
//   //  switch (true) {
//   //    case videoPlayer?.classList.contains("combo1"):
//   //      videoPlayer?.classList.remove("combo1");
//   //      return;
//   //    case videoPlayer?.classList.contains("combo2"):
//   //      videoPlayer?.classList.remove("combo2");
//   //      return;
//   //    default:
//   //      videoPlayer?.classList.remove("combo3");
//   //      return;
//   //  }
// }

async function fetchBlob(link: string): Promise<Blob> {
  try {
    const response = await (await fetch(link)).blob();
    return response;
  } catch (err) {
    throw new Error("Invalid URL");
  }
}
async function fetchBuffer(link: string): Promise<ArrayBuffer> {
  try {
    const response = await (await fetch(link)).blob();
    return await response.arrayBuffer();
  } catch (err) {
    throw new Error("Invalid URL");
  }
}
async function fetchUrl(link: string): Promise<string> {
  try {
    const response = await (await fetch(link)).blob();
    return URL.createObjectURL(response);
  } catch (err) {
    throw new Error("Invalid URL");
  }
}
async function fetchJson(link: string): Promise<prop> {
  try {
    const response: prop = await (await fetch(link)).json();

    response.arrayFrame = response.arrayFrame.map((anime) => {
      const x = +(anime as any).prop.split(",")[0];
      const y = +(anime as any).prop.split(",")[1];
      const translateX = +(anime as any).prop.split(",")[2];
      const translateY = +(anime as any).prop.split(",")[3];
      return [x, y, translateX, translateY];
    });
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Invalid URL");
  }
}

// // Gotta make this better
// function getSinger(ev: Event) {
//   if ((ev.target as HTMLDivElement).classList.contains("frame")) {
//     return (ev.target as HTMLDivElement).parentElement as HTMLDivElement;
//   } else if ((ev.target as HTMLDivElement).classList.contains("body")) {
//     return (ev.target as HTMLDivElement).parentElement!
//       .parentElement as HTMLDivElement;
//   } else if ((ev.target as HTMLDivElement).classList.contains("body-canvas")) {
//     return (ev.target as HTMLDivElement).parentElement!.parentElement!
//       .parentElement as HTMLDivElement;
//   } else if ((ev.target as HTMLDivElement).classList.contains("head")) {
//     return (ev.target as HTMLDivElement).parentElement!.parentElement!
//       .parentElement as HTMLDivElement;
//   } else if ((ev.target as HTMLDivElement).classList.contains("head-canvas")) {
//     return (ev.target as HTMLDivElement).parentElement!.parentElement!
//       .parentElement!.parentElement as HTMLDivElement;
//   }
//   return ev.target as HTMLDivElement;
// }

async function decodeAudio(
  buffer: ArrayBuffer,
  id: string,
  audioCtx: AudioContext
) {
  return new Audios(await audioCtx.decodeAudioData(buffer), id);
}

// function highlightHoveredSinger(ev: PointerEvent) {
//   const { left, right, top, bottom } = getMovingSongPosition(ev);
//   // Highlighting the hovered singer
//   global.singers.forEach((singer) => singer.classList.add("active"));
//   global.singersPost.forEach((singer) => {
//     const isInsideSinger =
//       singer.left < left &&
//       right < singer.right &&
//       singer.top < top &&
//       bottom < singer.bottom;
//     if (isInsideSinger) {
//       singer.element.style.opacity = "1";
//     } else if (!singer.element.getAttribute("data-song-id")) {
//       singer.element.style.opacity = "0.6";
//     }
//   });
// }

function startApplication(version: number) {
  if (version === 0) {
    console.log("error game version shouldn't be zero");
    // Handle Error
  } else {
    let allAudioLinks: { [key: number]: string } = {};
    let allVideoLinks: { [key: number]: string } = {};
    let allSpriteLinks: { [key: number]: string } = {};
    let allSpriteHdLinks: { [key: number]: string } = {};
    let allJsonLinks: { [key: number]: string } = {};

    switch (version) {
      // There has to be a better way
      case 1:
        global.beat = 55; //100ms
        allAudioLinks = {
          1: "/public/v1/audios/1_lead.ogg",
          2: "/public/v1/audios/2_deux.ogg",
          3: "/public/v1/audios/3_kosh.ogg",
          4: "/public/v1/audios/4_shpok.ogg",
          5: "/public/v1/audios/5_tom.ogg",
          6: "/public/v1/audios/6_nouana.ogg",
          7: "/public/v1/audios/7_scratch.ogg",
          8: "/public/v1/audios/8_trill.ogg",
          9: "/public/v1/audios/9_bass.ogg",
          10: "/public/v1/audios/10_uh.ogg",
          11: "/public/v1/audios/11_nugu.ogg",
          12: "/public/v1/audios/12_guit.ogg",
          13: "/public/v1/audios/13_tromp.ogg",
          14: "/public/v1/audios/14_pouin.ogg",
          15: "/public/v1/audios/15_tung.ogg",
          16: "/public/v1/audios/16_aoun.ogg",
          17: "/public/v1/audios/17_hum.ogg",
          18: "/public/v1/audios/18_get.ogg",
          19: "/public/v1/audios/19_tellme.ogg",
          20: "/public/v1/audios/20_make.ogg",
          21: "/public/v1/audios/21_bonus.ogg",
          22: "/public/v1/audios/22_bonus.ogg",
          23: "/public/v1/audios/23_bonus.ogg",
        };
        allVideoLinks = {
          1: "/public/v1/videos/video1.webm",
          2: "/public/v1/videos/video2.webm",
          3: "/public/v1/videos/video3.webm",
        };
        allSpriteLinks = {
          1: "/public/v1/sprites/1_lead-sprite.png",
          2: "/public/v1/sprites/2_deux-sprite.png",
          3: "/public/v1/sprites/3_kosh-sprite.png",
          4: "/public/v1/sprites/4_shpok-sprite.png",
          5: "/public/v1/sprites/5_tom-sprite.png",
          6: "/public/v1/sprites/6_nouana-sprite.png",
          7: "/public/v1/sprites/7_scratch-sprite.png",
          8: "/public/v1/sprites/8_trill-sprite.png",
          9: "/public/v1/sprites/9_bass-sprite.png",
          10: "/public/v1/sprites/10_uh-sprite.png",
          11: "/public/v1/sprites/11_nugu-sprite.png",
          12: "/public/v1/sprites/12_guit-sprite.png",
          13: "/public/v1/sprites/13_tromp-sprite.png",
          14: "/public/v1/sprites/14_pouin-sprite.png",
          15: "/public/v1/sprites/15_tung-sprite.png",
          16: "/public/v1/sprites/16_aoun-sprite.png",
          17: "/public/v1/sprites/17_hum-sprite.png",
          18: "/public/v1/sprites/18_get-sprite.png",
          19: "/public/v1/sprites/19_tellme-sprite.png",
          20: "/public/v1/sprites/20_make-sprite.png",
        };
        allSpriteHdLinks = {
          1: "/public/v1/sprites/1_lead-sprite-hd.png",
          2: "/public/v1/sprites/2_deux-sprite-hd.png",
          3: "/public/v1/sprites/3_kosh-sprite-hd.png",
          4: "/public/v1/sprites/4_shpok-sprite-hd.png",
          5: "/public/v1/sprites/5_tom-sprite-hd.png",
          6: "/public/v1/sprites/6_nouana-sprite-hd.png",
          7: "/public/v1/sprites/7_scratch-sprite-hd.png",
          8: "/public/v1/sprites/8_trill-sprite-hd.png",
          9: "/public/v1/sprites/9_bass-sprite-hd.png",
          10: "/public/v1/sprites/10_uh-sprite-hd.png",
          11: "/public/v1/sprites/11_nugu-sprite-hd.png",
          12: "/public/v1/sprites/12_guit-sprite-hd.png",
          13: "/public/v1/sprites/13_tromp-sprite-hd.png",
          14: "/public/v1/sprites/14_pouin-sprite-hd.png",
          15: "/public/v1/sprites/15_tung-sprite-hd.png",
          16: "/public/v1/sprites/16_aoun-sprite-hd.png",
          17: "/public/v1/sprites/17_hum-sprite-hd.png",
          18: "/public/v1/sprites/18_get-sprite-hd.png",
          19: "/public/v1/sprites/19_tellme-sprite-hd.png",
          20: "/public/v1/sprites/20_make-sprite-hd.png",
        };
        allJsonLinks = {
          1: "/public/v1/json/1_lead.json",
          2: "/public/v1/json/2_deux.json",
          3: "/public/v1/json/3_kosh.json",
          4: "/public/v1/json/4_shpok.json",
          5: "/public/v1/json/5_tom.json",
          6: "/public/v1/json/6_nouana.json",
          7: "/public/v1/json/7_scratch.json",
          8: "/public/v1/json/8_trill.json",
          9: "/public/v1/json/9_bass.json",
          10: "/public/v1/json/10_uh.json",
          11: "/public/v1/json/11_nugu.json",
          12: "/public/v1/json/12_guit.json",
          13: "/public/v1/json/13_tromp.json",
          14: "/public/v1/json/14_pouin.json",
          15: "/public/v1/json/15_tung.json",
          16: "/public/v1/json/16_aoun.json",
          17: "/public/v1/json/17_hum.json",
          18: "/public/v1/json/18_get.json",
          19: "/public/v1/json/19_tellme.json",
          20: "/public/v1/json/20_make.json",
        };
        break;
      case 2:
        global.beat = 45;
        allAudioLinks = {
          1: "/public/v2/audios/beat1.ogg",
          2: "/public/v2/audios/beat2.ogg",
          3: "/public/v2/audios/beat3.ogg",
          4: "/public/v2/audios/beat4.ogg",
          5: "/public/v2/audios/beat5.ogg",
          6: "/public/v2/audios/coeur1.ogg",
          7: "/public/v2/audios/coeur2.ogg",
          8: "/public/v2/audios/coeur3.ogg",
          9: "/public/v2/audios/effet1.ogg",
          10: "/public/v2/audios/effet2.ogg",
          11: "/public/v2/audios/effet3.ogg",
          12: "/public/v2/audios/effet4.ogg",
          13: "/public/v2/audios/effet5.ogg",
          14: "/public/v2/audios/melo1.ogg",
          15: "/public/v2/audios/melo2.ogg",
          16: "/public/v2/audios/melo3.ogg",
          17: "/public/v2/audios/melo4.ogg",
          18: "/public/v2/audios/melo5.ogg",
          19: "/public/v2/audios/voix1.ogg",
          20: "/public/v2/audios/voix2.ogg",
          21: "/public/v2/audios/21_bonus.ogg",
          22: "/public/v2/audios/22_bonus.ogg",
          23: "/public/v2/audios/23_bonus.ogg",
        };
        allSpriteLinks = {
          1: "/public/v2/sprites/beat1-sprite.png",
          2: "/public/v2/sprites/beat2-sprite.png",
          3: "/public/v2/sprites/beat3-sprite.png",
          4: "/public/v2/sprites/beat4-sprite.png",
          5: "/public/v2/sprites/beat5-sprite.png",
          6: "/public/v2/sprites/coeur1-sprite.png",
          7: "/public/v2/sprites/coeur2-sprite.png",
          8: "/public/v2/sprites/coeur3-sprite.png",
          9: "/public/v2/sprites/effet1-sprite.png",
          10: "/public/v2/sprites/effet2-sprite.png",
          11: "/public/v2/sprites/effet3-sprite.png",
          12: "/public/v2/sprites/effet4-sprite.png",
          13: "/public/v2/sprites/effet5-sprite.png",
          14: "/public/v2/sprites/melo1-sprite.png",
          15: "/public/v2/sprites/melo2-sprite.png",
          16: "/public/v2/sprites/melo3-sprite.png",
          17: "/public/v2/sprites/melo4-sprite.png",
          18: "/public/v2/sprites/melo5-sprite.png",
          19: "/public/v2/sprites/voix1-sprite.png",
          20: "/public/v2/sprites/voix2-sprite.png",
        };
        allSpriteHdLinks = {
          1: "/public/v2/sprites/beat1-sprite-hd.png",
          2: "/public/v2/sprites/beat2-sprite-hd.png",
          3: "/public/v2/sprites/beat3-sprite-hd.png",
          4: "/public/v2/sprites/beat4-sprite-hd.png",
          5: "/public/v2/sprites/beat5-sprite-hd.png",
          6: "/public/v2/sprites/coeur1-sprite-hd.png",
          7: "/public/v2/sprites/coeur2-sprite-hd.png",
          8: "/public/v2/sprites/coeur3-sprite-hd.png",
          9: "/public/v2/sprites/effet1-sprite-hd.png",
          10: "/public/v2/sprites/effet2-sprite-hd.png",
          11: "/public/v2/sprites/effet3-sprite-hd.png",
          12: "/public/v2/sprites/effet4-sprite-hd.png",
          13: "/public/v2/sprites/effet5-sprite-hd.png",
          14: "/public/v2/sprites/melo1-sprite-hd.png",
          15: "/public/v2/sprites/melo2-sprite-hd.png",
          16: "/public/v2/sprites/melo3-sprite-hd.png",
          17: "/public/v2/sprites/melo4-sprite-hd.png",
          18: "/public/v2/sprites/melo5-sprite-hd.png",
          19: "/public/v2/sprites/voix1-sprite-hd.png",
          20: "/public/v2/sprites/voix2-sprite-hd.png",
        };
        allJsonLinks = {
          1: "/public/v2/json/beat1.json",
          2: "/public/v2/json/beat2.json",
          3: "/public/v2/json/beat3.json",
          4: "/public/v2/json/beat4.json",
          5: "/public/v2/json/beat5.json",
          6: "/public/v2/json/coeur1.json",
          7: "/public/v2/json/coeur2.json",
          8: "/public/v2/json/coeur3.json",
          9: "/public/v2/json/effet1.json",
          10: "/public/v2/json/effet2.json",
          11: "/public/v2/json/effet3.json",
          12: "/public/v2/json/effet4.json",
          13: "/public/v2/json/effet5.json",
          14: "/public/v2/json/melo1.json",
          15: "/public/v2/json/melo2.json",
          16: "/public/v2/json/melo3.json",
          17: "/public/v2/json/melo4.json",
          18: "/public/v2/json/melo5.json",
          19: "/public/v2/json/voix1.json",
          20: "/public/v2/json/voix2.json",
        };
        allVideoLinks = {
          1: "/public/v2/videos/video1.webm",
          2: "/public/v2/videos/video2.webm",
          3: "/public/v2/videos/video3.webm",
        };

        break;
      case 3:
        global.beat = 80;
        allAudioLinks = {
          1: "/public/v3/audios/drum1_ballet.ogg",
          2: "/public/v3/audios/drum2_kick.ogg",
          3: "/public/v3/audios/drum3_snare.ogg",
          4: "/public/v3/audios/drum4_lead.ogg",
          5: "/public/v3/audios/drum5_charley.ogg",
          6: "/public/v3/audios/effet1_long.ogg",
          7: "/public/v3/audios/effet2_daft1.ogg",
          8: "/public/v3/audios/effet3_tududu.ogg",
          9: "/public/v3/audios/effet4_daft2.ogg",
          10: "/public/v3/audios/effet5_rythme.ogg",
          11: "/public/v3/audios/melo1_tuu.ogg",
          12: "/public/v3/audios/melo2_indien.ogg",
          13: "/public/v3/audios/melo3_armo.ogg",
          14: "/public/v3/audios/melo4_clav.ogg",
          15: "/public/v3/audios/melo5_siffle.ogg",
          16: "/public/v3/audios/voix1_waya.ogg",
          17: "/public/v3/audios/voix2_ride.ogg",
          18: "/public/v3/audios/voix3_over.ogg",
          19: "/public/v3/audios/voix4_colors.ogg",
          20: "/public/v3/audios/voix5_sunrise.ogg",
          21: "/public/v3/audios/21_bonus.ogg",
          22: "/public/v3/audios/22_bonus.ogg",
          23: "/public/v3/audios/23_bonus.ogg",
        };
        allSpriteLinks = {
          1: "/public/v3/sprites/drum1_ballet-sprite.png",
          2: "/public/v3/sprites/drum2_kick-sprite.png",
          3: "/public/v3/sprites/drum3_snare-sprite.png",
          4: "/public/v3/sprites/drum4_lead-sprite.png",
          5: "/public/v3/sprites/drum5_charley-sprite.png",
          6: "/public/v3/sprites/effet1_long-sprite.png",
          7: "/public/v3/sprites/effet2_daft1-sprite.png",
          8: "/public/v3/sprites/effet3_tududu-sprite.png",
          9: "/public/v3/sprites/effet4_daft2-sprite.png",
          10: "/public/v3/sprites/effet5_rythme-sprite.png",
          11: "/public/v3/sprites/melo1_tuu-sprite.png",
          12: "/public/v3/sprites/melo2_indien-sprite.png",
          13: "/public/v3/sprites/melo3_armo-sprite.png",
          14: "/public/v3/sprites/melo4_clav-sprite.png",
          15: "/public/v3/sprites/melo5_siffle-sprite.png",
          16: "/public/v3/sprites/voix1_waya-sprite.png",
          17: "/public/v3/sprites/voix2_ride-sprite.png",
          18: "/public/v3/sprites/voix3_over-sprite.png",
          19: "/public/v3/sprites/voix4_colors-sprite.png",
          20: "/public/v3/sprites/voix5_sunrise-sprite.png",
        };
        allSpriteHdLinks = {
          1: "/public/v3/sprites/drum1_ballet-sprite-hd.png",
          2: "/public/v3/sprites/drum2_kick-sprite-hd.png",
          3: "/public/v3/sprites/drum3_snare-sprite-hd.png",
          4: "/public/v3/sprites/drum4_lead-sprite-hd.png",
          5: "/public/v3/sprites/drum5_charley-sprite-hd.png",
          6: "/public/v3/sprites/effet1_long-sprite-hd.png",
          7: "/public/v3/sprites/effet2_daft1-sprite-hd.png",
          8: "/public/v3/sprites/effet3_tududu-sprite-hd.png",
          9: "/public/v3/sprites/effet4_daft2-sprite-hd.png",
          10: "/public/v3/sprites/effet5_rythme-sprite-hd.png",
          11: "/public/v3/sprites/melo1_tuu-sprite-hd.png",
          12: "/public/v3/sprites/melo2_indien-sprite-hd.png",
          13: "/public/v3/sprites/melo3_armo-sprite-hd.png",
          14: "/public/v3/sprites/melo4_clav-sprite-hd.png",
          15: "/public/v3/sprites/melo5_siffle-sprite-hd.png",
          16: "/public/v3/sprites/voix1_waya-sprite-hd.png",
          17: "/public/v3/sprites/voix2_ride-sprite-hd.png",
          18: "/public/v3/sprites/voix3_over-sprite-hd.png",
          19: "/public/v3/sprites/voix4_colors-sprite-hd.png",
          20: "/public/v3/sprites/voix5_sunrise-sprite-hd.png",
        };
        allJsonLinks = {
          1: "/public/v3/json/drum1_ballet.json",
          2: "/public/v3/json/drum2_kick.json",
          3: "/public/v3/json/drum3_snare.json",
          4: "/public/v3/json/drum4_lead.json",
          5: "/public/v3/json/drum5_charley.json",
          6: "/public/v3/json/effet1_long.json",
          7: "/public/v3/json/effet2_daft1.json",
          8: "/public/v3/json/effet3_tududu.json",
          9: "/public/v3/json/effet4_daft2.json",
          10: "/public/v3/json/effet5_rythme.json",
          11: "/public/v3/json/melo1_tuu.json",
          12: "/public/v3/json/melo2_indien.json",
          13: "/public/v3/json/melo3_armo.json",
          14: "/public/v3/json/melo4_clav.json",
          15: "/public/v3/json/melo5_siffle.json",
          16: "/public/v3/json/voix1_waya.json",
          17: "/public/v3/json/voix2_ride.json",
          18: "/public/v3/json/voix3_over.json",
          19: "/public/v3/json/voix4_colors.json",
          20: "/public/v3/json/voix5_sunrise.json",
        };
        allVideoLinks = {
          1: "/public/v3/videos/video1.webm",
          2: "/public/v3/videos/video2.webm",
          3: "/public/v3/videos/video3.webm",
        };
        break;
      case 4:
        global.beat = 80;
        allAudioLinks = {
          1: "/public/v4/audios/chips1_feel.ogg",
          2: "/public/v4/audios/chips2_chillin.ogg",
          3: "/public/v4/audios/chips3_yeah.ogg",
          4: "/public/v4/audios/chips4_filback.ogg",
          5: "/public/v4/audios/chips5_teylo.ogg",
          6: "/public/v4/audios/drum1_kick.ogg",
          7: "/public/v4/audios/drum2_snare.ogg",
          8: "/public/v4/audios/drum3_touti.ogg",
          9: "/public/v4/audios/drum4_charley.ogg",
          10: "/public/v4/audios/drum5_chatom.ogg",
          11: "/public/v4/audios/effect1_bass.ogg",
          12: "/public/v4/audios/effect2_enigmatic.ogg",
          13: "/public/v4/audios/effect3_cry.ogg",
          14: "/public/v4/audios/effect4_odoyouno.ogg",
          15: "/public/v4/audios/effect5_oua.ogg",
          16: "/public/v4/audios/melo1_toun.ogg",
          17: "/public/v4/audios/melo2_flute.ogg",
          18: "/public/v4/audios/melo3_neou.ogg",
          19: "/public/v4/audios/melo4_hu.ogg",
          20: "/public/v4/audios/melo5_ah.ogg",
          21: "/public/v4/audios/21_bonus.ogg",
          22: "/public/v4/audios/22_bonus.ogg",
          23: "/public/v4/audios/23_bonus.ogg",
        };
        allSpriteLinks = {
          1: "/public/v4/sprites/chips1_feel-sprite.png",
          2: "/public/v4/sprites/chips2_chillin-sprite.png",
          3: "/public/v4/sprites/chips3_yeah-sprite.png",
          4: "/public/v4/sprites/chips4_filback-sprite.png",
          5: "/public/v4/sprites/chips5_teylo-sprite.png",
          6: "/public/v4/sprites/drum1_kick-sprite.png",
          7: "/public/v4/sprites/drum2_snare-sprite.png",
          8: "/public/v4/sprites/drum3_touti-sprite.png",
          9: "/public/v4/sprites/drum4_charley-sprite.png",
          10: "/public/v4/sprites/drum5_chatom-sprite.png",
          11: "/public/v4/sprites/effect1_bass-sprite.png",
          12: "/public/v4/sprites/effect2_enigmatic-sprite.png",
          13: "/public/v4/sprites/effect3_cry-sprite.png",
          14: "/public/v4/sprites/effect4_odoyouno-sprite.png",
          15: "/public/v4/sprites/effect5_oua-sprite.png",
          16: "/public/v4/sprites/melo1_toun-sprite.png",
          17: "/public/v4/sprites/melo2_flute-sprite.png",
          18: "/public/v4/sprites/melo3_neou-sprite.png",
          19: "/public/v4/sprites/melo4_hu-sprite.png",
          20: "/public/v4/sprites/melo5_ah-sprite.png",
        };
        allSpriteHdLinks = {
          1: "/public/v4/sprites/chips1_feel-sprite-hd.png",
          2: "/public/v4/sprites/chips2_chillin-sprite-hd.png",
          3: "/public/v4/sprites/chips3_yeah-sprite-hd.png",
          4: "/public/v4/sprites/chips4_filback-sprite-hd.png",
          5: "/public/v4/sprites/chips5_teylo-sprite-hd.png",
          6: "/public/v4/sprites/drum1_kick-sprite-hd.png",
          7: "/public/v4/sprites/drum2_snare-sprite-hd.png",
          8: "/public/v4/sprites/drum3_touti-sprite-hd.png",
          9: "/public/v4/sprites/drum4_charley-sprite-hd.png",
          10: "/public/v4/sprites/drum5_chatom-sprite-hd.png",
          11: "/public/v4/sprites/effect1_bass-sprite-hd.png",
          12: "/public/v4/sprites/effect2_enigmatic-sprite-hd.png",
          13: "/public/v4/sprites/effect3_cry-sprite-hd.png",
          14: "/public/v4/sprites/effect4_odoyouno-sprite-hd.png",
          15: "/public/v4/sprites/effect5_oua-sprite-hd.png",
          16: "/public/v4/sprites/melo1_toun-sprite-hd.png",
          17: "/public/v4/sprites/melo2_flute-sprite-hd.png",
          18: "/public/v4/sprites/melo3_neou-sprite-hd.png",
          19: "/public/v4/sprites/melo4_hu-sprite-hd.png",
          20: "/public/v4/sprites/melo5_ah-sprite-hd.png",
        };
        allJsonLinks = {
          1: "/public/v4/json/chips1_feel.json",
          2: "/public/v4/json/chips2_chillin.json",
          3: "/public/v4/json/chips3_yeah.json",
          4: "/public/v4/json/chips4_filback.json",
          5: "/public/v4/json/chips5_teylo.json",
          6: "/public/v4/json/drum1_kick.json",
          7: "/public/v4/json/drum2_snare.json",
          8: "/public/v4/json/drum3_touti.json",
          9: "/public/v4/json/drum4_charley.json",
          10: "/public/v4/json/drum5_chatom.json",
          11: "/public/v4/json/effect1_bass.json",
          12: "/public/v4/json/effect2_enigmatic.json",
          13: "/public/v4/json/effect3_cry.json",
          14: "/public/v4/json/effect4_odoyouno.json",
          15: "/public/v4/json/effect5_oua.json",
          16: "/public/v4/json/melo1_toun.json",
          17: "/public/v4/json/melo2_flute.json",
          18: "/public/v4/json/melo3_neou.json",
          19: "/public/v4/json/melo4_hu.json",
          20: "/public/v4/json/melo5_ah.json",
        };
        allVideoLinks = {
          1: "/public/v4/videos/video1.webm",
          2: "/public/v4/videos/video2.webm",
          3: "/public/v4/videos/video3.webm",
        };

        break;
      case 5:
        global.beat = 80;
        allAudioLinks = {
          1: "/public/v5/audios/1_poum.ogg",
          2: "/public/v5/audios/2_creuki.ogg",
          3: "/public/v5/audios/3_shaka.ogg",
          4: "/public/v5/audios/4_chouk.ogg",
          5: "/public/v5/audios/5_kaliak.ogg",
          6: "/public/v5/audios/6_tek.ogg",
          7: "/public/v5/audios/7_tuk.ogg",
          8: "/public/v5/audios/8_teung.ogg",
          9: "/public/v5/audios/9_ting.ogg",
          10: "/public/v5/audios/10_kougou.ogg",
          11: "/public/v5/audios/11_parimba.ogg",
          12: "/public/v5/audios/12_coloko.ogg",
          13: "/public/v5/audios/13_clav.ogg",
          14: "/public/v5/audios/14_tromp.ogg",
          15: "/public/v5/audios/15_trompolo.ogg",
          16: "/public/v5/audios/16_bass.ogg",
          17: "/public/v5/audios/17_wa.ogg",
          18: "/public/v5/audios/18_ya.ogg",
          19: "/public/v5/audios/19_palapa.ogg",
          20: "/public/v5/audios/20_oh.ogg",
          21: "/public/v5/audios/21_bonus.ogg",
          22: "/public/v5/audios/22_bonus.ogg",
          23: "/public/v5/audios/23_bonus.ogg",
        };
        allVideoLinks = {
          1: "/public/v5/videos/video1.webm",
          2: "/public/v5/videos/video2.webm",
          3: "/public/v5/videos/video3.webm",
        };
        allSpriteLinks = {
          1: "/public/v5/sprites/1_poum-sprite.png",
          2: "/public/v5/sprites/2_creuki-sprite.png",
          3: "/public/v5/sprites/3_shaka-sprite.png",
          4: "/public/v5/sprites/4_chouk-sprite.png",
          5: "/public/v5/sprites/5_kaliak-sprite.png",
          6: "/public/v5/sprites/6_tek-sprite.png",
          7: "/public/v5/sprites/7_tuk-sprite.png",
          8: "/public/v5/sprites/8_teung-sprite.png",
          9: "/public/v5/sprites/9_ting-sprite.png",
          10: "/public/v5/sprites/10_kougou-sprite.png",
          11: "/public/v5/sprites/11_parimba-sprite.png",
          12: "/public/v5/sprites/12_coloko-sprite.png",
          13: "/public/v5/sprites/13_clav-sprite.png",
          14: "/public/v5/sprites/14_tromp-sprite.png",
          15: "/public/v5/sprites/15_trompolo-sprite.png",
          16: "/public/v5/sprites/16_bass-sprite.png",
          17: "/public/v5/sprites/17_wa-sprite.png",
          18: "/public/v5/sprites/18_ya-sprite.png",
          19: "/public/v5/sprites/19_palapa-sprite.png",
          20: "/public/v5/sprites/20_oh-sprite.png",
        };
        allSpriteHdLinks = {
          1: "/public/v5/sprites/1_poum-sprite-hd.png",
          2: "/public/v5/sprites/2_creuki-sprite-hd.png",
          3: "/public/v5/sprites/3_shaka-sprite-hd.png",
          4: "/public/v5/sprites/4_chouk-sprite-hd.png",
          5: "/public/v5/sprites/5_kaliak-sprite-hd.png",
          6: "/public/v5/sprites/6_tek-sprite-hd.png",
          7: "/public/v5/sprites/7_tuk-sprite-hd.png",
          8: "/public/v5/sprites/8_teung-sprite-hd.png",
          9: "/public/v5/sprites/9_ting-sprite-hd.png",
          10: "/public/v5/sprites/10_kougou-sprite-hd.png",
          11: "/public/v5/sprites/11_parimba-sprite-hd.png",
          12: "/public/v5/sprites/12_coloko-sprite-hd.png",
          13: "/public/v5/sprites/13_clav-sprite-hd.png",
          14: "/public/v5/sprites/14_tromp-sprite-hd.png",
          15: "/public/v5/sprites/15_trompolo-sprite-hd.png",
          16: "/public/v5/sprites/16_bass-sprite-hd.png",
          17: "/public/v5/sprites/17_wa-sprite-hd.png",
          18: "/public/v5/sprites/18_ya-sprite-hd.png",
          19: "/public/v5/sprites/19_palapa-sprite-hd.png",
          20: "/public/v5/sprites/20_oh-sprite-hd.png",
        };
        allJsonLinks = {
          1: "/public/v5/json/1_poum.json",
          2: "/public/v5/json/2_creuki.json",
          3: "/public/v5/json/3_shaka.json",
          4: "/public/v5/json/4_chouk.json",
          5: "/public/v5/json/5_kaliak.json",
          6: "/public/v5/json/6_tek.json",
          7: "/public/v5/json/7_tuk.json",
          8: "/public/v5/json/8_teung.json",
          9: "/public/v5/json/9_ting.json",
          10: "/public/v5/json/10_kougou.json",
          11: "/public/v5/json/11_parimba.json",
          12: "/public/v5/json/12_coloko.json",
          13: "/public/v5/json/13_clav.json",
          14: "/public/v5/json/14_tromp.json",
          15: "/public/v5/json/15_trompolo.json",
          16: "/public/v5/json/16_bass.json",
          17: "/public/v5/json/17_wa.json",
          18: "/public/v5/json/18_ya.json",
          19: "/public/v5/json/19_palapa.json",
          20: "/public/v5/json/20_oh.json",
        };

        break;
      case 6:
        global.beat = 7;
        allAudioLinks = {
          1: "/public/v6/audios/1_kick.ogg",
          2: "/public/v6/audios/2_snare.ogg",
          3: "/public/v6/audios/3_kanye.ogg",
          4: "/public/v6/audios/4_tuctuc.ogg",
          5: "/public/v6/audios/5_break.ogg",
          6: "/public/v6/audios/6_cribasse.ogg",
          7: "/public/v6/audios/7_distotut.ogg",
          8: "/public/v6/audios/8_screw.ogg",
          9: "/public/v6/audios/9_shaolin.ogg",
          10: "/public/v6/audios/10_shower.ogg",
          11: "/public/v6/audios/11_basse.ogg",
          12: "/public/v6/audios/12_hou.ogg",
          13: "/public/v6/audios/13_clav.ogg",
          14: "/public/v6/audios/14_synth.ogg",
          15: "/public/v6/audios/15_yah.ogg",
          16: "/public/v6/audios/16_hurry.ogg",
          17: "/public/v6/audios/17_good.ogg",
          18: "/public/v6/audios/18_mind.ogg",
          19: "/public/v6/audios/19_haha.ogg",
          20: "/public/v6/audios/20_wow.ogg",
          21: "/public/v6/audios/21_bonus.ogg",
          22: "/public/v6/audios/22_bonus.ogg",
          23: "/public/v6/audios/23_bonus.ogg",
        };
        allVideoLinks = {
          1: "/public/v6/videos/video1.webm",
          2: "/public/v6/videos/video2.webm",
          3: "/public/v6/videos/video3.webm",
        };
        allSpriteLinks = {
          1: "/public/v6/sprites/1_kick-sprite.png",
          2: "/public/v6/sprites/2_snare-sprite.png",
          3: "/public/v6/sprites/3_kanye-sprite.png",
          4: "/public/v6/sprites/4_tuctuc-sprite.png",
          5: "/public/v6/sprites/5_break-sprite.png",
          6: "/public/v6/sprites/6_cribasse-sprite.png",
          7: "/public/v6/sprites/7_distotut-sprite.png",
          8: "/public/v6/sprites/8_screw-sprite.png",
          9: "/public/v6/sprites/9_shaolin-sprite.png",
          10: "/public/v6/sprites/10_shower-sprite.png",
          11: "/public/v6/sprites/11_basse-sprite.png",
          12: "/public/v6/sprites/12_hou-sprite.png",
          13: "/public/v6/sprites/13_clav-sprite.png",
          14: "/public/v6/sprites/14_synth-sprite.png",
          15: "/public/v6/sprites/15_yah-sprite.png",
          16: "/public/v6/sprites/16_hurry-sprite.png",
          17: "/public/v6/sprites/17_good-sprite.png",
          18: "/public/v6/sprites/18_mind-sprite.png",
          19: "/public/v6/sprites/19_haha-sprite.png",
          20: "/public/v6/sprites/20_wow-sprite.png",
        };
        allSpriteHdLinks = {
          1: "/public/v6/sprites/1_kick-sprite-hd.png",
          2: "/public/v6/sprites/2_snare-sprite-hd.png",
          3: "/public/v6/sprites/3_kanye-sprite-hd.png",
          4: "/public/v6/sprites/4_tuctuc-sprite-hd.png",
          5: "/public/v6/sprites/5_break-sprite-hd.png",
          6: "/public/v6/sprites/6_cribasse-sprite-hd.png",
          7: "/public/v6/sprites/7_distotut-sprite-hd.png",
          8: "/public/v6/sprites/8_screw-sprite-hd.png",
          9: "/public/v6/sprites/9_shaolin-sprite-hd.png",
          10: "/public/v6/sprites/10_shower-sprite-hd.png",
          11: "/public/v6/sprites/11_basse-sprite-hd.png",
          12: "/public/v6/sprites/12_hou-sprite-hd.png",
          13: "/public/v6/sprites/13_clav-sprite-hd.png",
          14: "/public/v6/sprites/14_synth-sprite-hd.png",
          15: "/public/v6/sprites/15_yah-sprite-hd.png",
          16: "/public/v6/sprites/16_hurry-sprite-hd.png",
          17: "/public/v6/sprites/17_good-sprite-hd.png",
          18: "/public/v6/sprites/18_mind-sprite-hd.png",
          19: "/public/v6/sprites/19_haha-sprite-hd.png",
          20: "/public/v6/sprites/20_wow-sprite-hd.png",
        };
        allJsonLinks = {
          1: "/public/v6/json/1_kick.json",
          2: "/public/v6/json/2_snare.json",
          3: "/public/v6/json/3_kanye.json",
          4: "/public/v6/json/4_tuctuc.json",
          5: "/public/v6/json/5_break.json",
          6: "/public/v6/json/6_cribasse.json",
          7: "/public/v6/json/7_distotut.json",
          8: "/public/v6/json/8_screw.json",
          9: "/public/v6/json/9_shaolin.json",
          10: "/public/v6/json/10_shower.json",
          11: "/public/v6/json/11_basse.json",
          12: "/public/v6/json/12_hou.json",
          13: "/public/v6/json/13_clav.json",
          14: "/public/v6/json/14_synth.json",
          15: "/public/v6/json/15_yah.json",
          16: "/public/v6/json/16_hurry.json",
          17: "/public/v6/json/17_good.json",
          18: "/public/v6/json/18_mind.json",
          19: "/public/v6/json/19_haha.json",
          20: "/public/v6/json/20_wow.json",
        };

        break;
      case 7:
        global.beat = 65;
        allAudioLinks = {
          1: "/public/v7/audios/1_lead.ogg",
          2: "/public/v7/audios/2_pouin.ogg",
          3: "/public/v7/audios/3_tung.ogg",
          4: "/public/v7/audios/4_tabla.ogg",
          5: "/public/v7/audios/5_tuduki.ogg",
          6: "/public/v7/audios/6_bass.ogg",
          7: "/public/v7/audios/7_bourdon.ogg",
          8: "/public/v7/audios/8_campan.ogg",
          9: "/public/v7/audios/9_kum.ogg",
          10: "/public/v7/audios/10_string.ogg",
          11: "/public/v7/audios/11_citar.ogg",
          12: "/public/v7/audios/12_guit.ogg",
          13: "/public/v7/audios/13_tromp.ogg",
          14: "/public/v7/audios/14_taoung.ogg",
          15: "/public/v7/audios/15_sifle.ogg",
          16: "/public/v7/audios/16_djindr.ogg",
          17: "/public/v7/audios/17_djinga.ogg",
          18: "/public/v7/audios/18_djinta.ogg",
          19: "/public/v7/audios/19_jeevan.ogg",
          20: "/public/v7/audios/20_yaha.ogg",
          21: "/public/v7/audios/21_bonus.ogg",
          22: "/public/v7/audios/22_bonus.ogg",
          23: "/public/v7/audios/23_bonus.ogg",
        };
        allVideoLinks = {
          1: "/public/v7/videos/video1.webm",
          2: "/public/v7/videos/video2.webm",
          3: "/public/v7/videos/video3.webm",
        };
        allSpriteLinks = {
          1: "/public/v7/sprites/1_lead-sprite.png",
          2: "/public/v7/sprites/2_pouin-sprite.png",
          3: "/public/v7/sprites/3_tung-sprite.png",
          4: "/public/v7/sprites/4_tabla-sprite.png",
          5: "/public/v7/sprites/5_tuduki-sprite.png",
          6: "/public/v7/sprites/6_bass-sprite.png",
          7: "/public/v7/sprites/7_bourdon-sprite.png",
          8: "/public/v7/sprites/8_campan-sprite.png",
          9: "/public/v7/sprites/9_kum-sprite.png",
          10: "/public/v7/sprites/10_string-sprite.png",
          11: "/public/v7/sprites/11_citar-sprite.png",
          12: "/public/v7/sprites/12_guit-sprite.png",
          13: "/public/v7/sprites/13_tromp-sprite.png",
          14: "/public/v7/sprites/14_taoung-sprite.png",
          15: "/public/v7/sprites/15_sifle-sprite.png",
          16: "/public/v7/sprites/16_djindr-sprite.png",
          17: "/public/v7/sprites/17_djinga-sprite.png",
          18: "/public/v7/sprites/18_djinta-sprite.png",
          19: "/public/v7/sprites/19_jeevan-sprite.png",
          20: "/public/v7/sprites/20_yaha-sprite.png",
        };
        allSpriteHdLinks = {
          1: "/public/v7/sprites/1_lead-sprite-hd.png",
          2: "/public/v7/sprites/2_pouin-sprite-hd.png",
          3: "/public/v7/sprites/3_tung-sprite-hd.png",
          4: "/public/v7/sprites/4_tabla-sprite-hd.png",
          5: "/public/v7/sprites/5_tuduki-sprite-hd.png",
          6: "/public/v7/sprites/6_bass-sprite-hd.png",
          7: "/public/v7/sprites/7_bourdon-sprite-hd.png",
          8: "/public/v7/sprites/8_campan-sprite-hd.png",
          9: "/public/v7/sprites/9_kum-sprite-hd.png",
          10: "/public/v7/sprites/10_string-sprite-hd.png",
          11: "/public/v7/sprites/11_citar-sprite-hd.png",
          12: "/public/v7/sprites/12_guit-sprite-hd.png",
          13: "/public/v7/sprites/13_tromp-sprite-hd.png",
          14: "/public/v7/sprites/14_taoung-sprite-hd.png",
          15: "/public/v7/sprites/15_sifle-sprite-hd.png",
          16: "/public/v7/sprites/16_djindr-sprite-hd.png",
          17: "/public/v7/sprites/17_djinga-sprite-hd.png",
          18: "/public/v7/sprites/18_djinta-sprite-hd.png",
          19: "/public/v7/sprites/19_jeevan-sprite-hd.png",
          20: "/public/v7/sprites/20_yaha-sprite-hd.png",
        };
        allJsonLinks = {
          1: "/public/v7/json/1_lead.json",
          2: "/public/v7/json/2_pouin.json",
          3: "/public/v7/json/3_tung.json",
          4: "/public/v7/json/4_tabla.json",
          5: "/public/v7/json/5_tuduki.json",
          6: "/public/v7/json/6_bass.json",
          7: "/public/v7/json/7_bourdon.json",
          9: "/public/v7/json/9_kum.json",
          10: "/public/v7/json/10_string.json",
          11: "/public/v7/json/11_citar.json",
          12: "/public/v7/json/12_guit.json",
          13: "/public/v7/json/13_tromp.json",
          14: "/public/v7/json/14_taoung.json",
          15: "/public/v7/json/15_sifle.json",
          16: "/public/v7/json/16_djindr.json",
          17: "/public/v7/json/17_djinga.json",
          18: "/public/v7/json/18_djinta.json",
          19: "/public/v7/json/19_jeevan.json",
          20: "/public/v7/json/20_yaha.json",
        };

        break;
      case 8:
        global.beat = 7;
        allAudioLinks = {
          1: "/public/v8/audios/1_atlanta.ogg",
          2: "/public/v8/audios/2_tuctom.ogg",
          3: "/public/v8/audios/3_foubreak.ogg",
          4: "/public/v8/audios/4_koukaki.ogg",
          5: "/public/v8/audios/5_koungou.ogg",
          6: "/public/v8/audios/6_bass.ogg",
          7: "/public/v8/audios/7_monk.ogg",
          8: "/public/v8/audios/8_sonar.ogg",
          9: "/public/v8/audios/9_souffle.ogg",
          10: "/public/v8/audios/10_epifle.ogg",
          11: "/public/v8/audios/11_arpeg.ogg",
          12: "/public/v8/audios/12_tromp.ogg",
          13: "/public/v8/audios/13_pizzi.ogg",
          14: "/public/v8/audios/14_organ.ogg",
          15: "/public/v8/audios/15_synth.ogg",
          16: "/public/v8/audios/16_follow.ogg",
          17: "/public/v8/audios/17_choir.ogg",
          18: "/public/v8/audios/18_houhou.ogg",
          19: "/public/v8/audios/19_reach.ogg",
          20: "/public/v8/audios/20_believe.ogg",
          21: "/public/v8/audios/21_bonus.ogg",
          22: "/public/v8/audios/22_bonus.ogg",
          23: "/public/v8/audios/23_bonus.ogg",
        };
        allVideoLinks = {
          1: "/public/v8/videos/video1.webm",
          2: "/public/v8/videos/video2.webm",
          3: "/public/v8/videos/video3.webm",
        };
        allSpriteLinks = {
          1: "/public/v8/sprites/1_atlanta-sprite.png",
          2: "/public/v8/sprites/2_tuctom-sprite.png",
          3: "/public/v8/sprites/3_foubreak-sprite.png",
          4: "/public/v8/sprites/4_koukaki-sprite.png",
          5: "/public/v8/sprites/5_koungou-sprite.png",
          6: "/public/v8/sprites/6_bass-sprite.png",
          7: "/public/v8/sprites/7_monk-sprite.png",
          8: "/public/v8/sprites/8_sonar-sprite.png",
          9: "/public/v8/sprites/9_souffle-sprite.png",
          10: "/public/v8/sprites/10_epifle-sprite.png",
          11: "/public/v8/sprites/11_arpeg-sprite.png",
          12: "/public/v8/sprites/12_tromp-sprite.png",
          13: "/public/v8/sprites/13_pizzi-sprite.png",
          14: "/public/v8/sprites/14_organ-sprite.png",
          15: "/public/v8/sprites/15_synth-sprite.png",
          16: "/public/v8/sprites/16_follow-sprite.png",
          17: "/public/v8/sprites/17_choir-sprite.png",
          18: "/public/v8/sprites/18_houhou-sprite.png",
          19: "/public/v8/sprites/19_reach-sprite.png",
          20: "/public/v8/sprites/20_believe-sprite.png",
        };
        allSpriteHdLinks = {
          1: "/public/v8/sprites/1_atlanta-sprite-hd.png",
          2: "/public/v8/sprites/2_tuctom-sprite-hd.png",
          3: "/public/v8/sprites/3_foubreak-sprite-hd.png",
          4: "/public/v8/sprites/4_koukaki-sprite-hd.png",
          5: "/public/v8/sprites/5_koungou-sprite-hd.png",
          6: "/public/v8/sprites/6_bass-sprite-hd.png",
          7: "/public/v8/sprites/7_monk-sprite-hd.png",
          8: "/public/v8/sprites/8_sonar-sprite-hd.png",
          9: "/public/v8/sprites/9_souffle-sprite-hd.png",
          10: "/public/v8/sprites/10_epifle-sprite-hd.png",
          11: "/public/v8/sprites/11_arpeg-sprite-hd.png",
          12: "/public/v8/sprites/12_tromp-sprite-hd.png",
          13: "/public/v8/sprites/13_pizzi-sprite-hd.png",
          14: "/public/v8/sprites/14_organ-sprite-hd.png",
          15: "/public/v8/sprites/15_synth-sprite-hd.png",
          16: "/public/v8/sprites/16_follow-sprite-hd.png",
          17: "/public/v8/sprites/17_choir-sprite-hd.png",
          18: "/public/v8/sprites/18_houhou-sprite-hd.png",
          19: "/public/v8/sprites/19_reach-sprite-hd.png",
          20: "/public/v8/sprites/20_believe-sprite-hd.png",
        };
        allJsonLinks = {
          1: "/public/v8/json/1_atlanta.json",
          2: "/public/v8/json/2_tuctom.json",
          3: "/public/v8/json/3_foubreak.json",
          4: "/public/v8/json/4_koukaki.json",
          5: "/public/v8/json/5_koungou.json",
          6: "/public/v8/json/6_bass.json",
          7: "/public/v8/json/7_monk.json",
          8: "/public/v8/json/8_sonar.json",
          9: "/public/v8/json/9_souffle.json",
          10: "/public/v8/json/10_epifle.json",
          11: "/public/v8/json/11_arpeg.json",
          12: "/public/v8/json/12_tromp.json",
          13: "/public/v8/json/13_pizzi.json",
          14: "/public/v8/json/14_organ.json",
          15: "/public/v8/json/15_synth.json",
          16: "/public/v8/json/16_follow.json",
          17: "/public/v8/json/17_choir.json",
          18: "/public/v8/json/18_houhou.json",
          19: "/public/v8/json/19_reach.json",
          20: "/public/v8/json/20_believe.json",
        };
        break;
      case 9:
        global.beat = 5;
        allAudioLinks = {
          1: "/public/v9/audios/01_boo_9.ogg",
          2: "/public/v9/audios/02_kevin.ogg",
          3: "/public/v9/audios/03_double_k.ogg",
          4: "/public/v9/audios/04_blue_gt.ogg",
          5: "/public/v9/audios/05_mj_182.ogg",
          6: "/public/v9/audios/06_boom_fuzz.ogg",
          7: "/public/v9/audios/07_asap_bee.ogg",
          8: "/public/v9/audios/08_m_o_g.ogg",
          9: "/public/v9/audios/09_arashi.ogg",
          10: "/public/v9/audios/10_big_duke.ogg",
          11: "/public/v9/audios/11_swingy.ogg",
          12: "/public/v9/audios/12_d_invaders.ogg",
          13: "/public/v9/audios/13_doo_doo.ogg",
          14: "/public/v9/audios/14_8_bit.ogg",
          15: "/public/v9/audios/15_kc_glow.ogg",
          16: "/public/v9/audios/16_el_cool_p.ogg",
          17: "/public/v9/audios/17_memphis.ogg",
          18: "/public/v9/audios/18_jogg_d.ogg",
          19: "/public/v9/audios/19_scooter.ogg",
          20: "/public/v9/audios/20_lil_blaze.ogg",
          21: "/public/v9/audios/21_bonus.ogg",
          22: "/public/v9/audios/22_bonus.ogg",
          23: "/public/v9/audios/23_bonus.ogg",
        };
        allVideoLinks = {
          1: "/public/v9/videos/video1.webm",
          2: "/public/v9/videos/video2.webm",
          3: "/public/v9/videos/video3.webm",
        };
        allSpriteLinks = {
          1: "/public/v9/sprites/01_boo_9-sprite.png",
          2: "/public/v9/sprites/02_kevin-sprite.png",
          3: "/public/v9/sprites/03_double_k-sprite.png",
          4: "/public/v9/sprites/04_blue_gt-sprite.png",
          5: "/public/v9/sprites/05_mj_182-sprite.png",
          6: "/public/v9/sprites/06_boom_fuzz-sprite.png",
          7: "/public/v9/sprites/07_asap_bee-sprite.png",
          8: "/public/v9/sprites/08_m_o_g-sprite.png",
          9: "/public/v9/sprites/09_arashi-sprite.png",
          10: "/public/v9/sprites/10_big_duke-sprite.png",
          11: "/public/v9/sprites/11_swingy-sprite.png",
          12: "/public/v9/sprites/12_d_invaders-sprite.png",
          13: "/public/v9/sprites/13_doo_doo-sprite.png",
          14: "/public/v9/sprites/14_8_bit-sprite.png",
          15: "/public/v9/sprites/15_kc_glow-sprite.png",
          16: "/public/v9/sprites/16_el_cool_p-sprite.png",
          17: "/public/v9/sprites/17_memphis-sprite.png",
          18: "/public/v9/sprites/18_jogg_d-sprite.png",
          19: "/public/v9/sprites/19_scooter-sprite.png",
          20: "/public/v9/sprites/20_lil_blaze-sprite.png",
        };
        allSpriteHdLinks = {
          1: "/public/v9/sprites/01_boo_9-sprite-hd.png",
          2: "/public/v9/sprites/02_kevin-sprite-hd.png",
          3: "/public/v9/sprites/03_double_k-sprite-hd.png",
          4: "/public/v9/sprites/04_blue_gt-sprite-hd.png",
          5: "/public/v9/sprites/05_mj_182-sprite-hd.png",
          6: "/public/v9/sprites/06_boom_fuzz-sprite-hd.png",
          7: "/public/v9/sprites/07_asap_bee-sprite-hd.png",
          8: "/public/v9/sprites/08_m_o_g-sprite-hd.png",
          9: "/public/v9/sprites/09_arashi-sprite-hd.png",
          10: "/public/v9/sprites/10_big_duke-sprite-hd.png",
          11: "/public/v9/sprites/11_swingy-sprite-hd.png",
          12: "/public/v9/sprites/12_d_invaders-sprite-hd.png",
          13: "/public/v9/sprites/13_doo_doo-sprite-hd.png",
          14: "/public/v9/sprites/14_8_bit-sprite-hd.png",
          15: "/public/v9/sprites/15_kc_glow-sprite-hd.png",
          16: "/public/v9/sprites/16_el_cool_p-sprite-hd.png",
          17: "/public/v9/sprites/17_memphis-sprite-hd.png",
          18: "/public/v9/sprites/18_jogg_d-sprite-hd.png",
          19: "/public/v9/sprites/19_scooter-sprite-hd.png",
          20: "/public/v9/sprites/20_lil_blaze-sprite-hd.png",
        };
        allJsonLinks = {
          1: "/public/v9/json/01_boo_9.json",
          2: "/public/v9/json/02_kevin.json",
          3: "/public/v9/json/03_double_k.json",
          4: "/public/v9/json/04_blue_gt.json",
          5: "/public/v9/json/05_mj_182.json",
          6: "/public/v9/json/06_boom_fuzz.json",
          7: "/public/v9/json/07_asap_bee.json",
          8: "/public/v9/json/08_m_o_g.json",
          9: "/public/v9/json/09_arashi.json",
          10: "/public/v9/json/10_big_duke.json",
          11: "/public/v9/json/11_swingy.json",
          12: "/public/v9/json/12_d_invaders.json",
          13: "/public/v9/json/13_doo_doo.json",
          14: "/public/v9/json/14_8_bit.json",
          15: "/public/v9/json/15_kc_glow.json",
          16: "/public/v9/json/16_el_cool_p.json",
          17: "/public/v9/json/17_memphis.json",
          18: "/public/v9/json/18_jogg_d.json",
          19: "/public/v9/json/19_scooter.json",
          20: "/public/v9/json/20_lil_blaze.json",
        };
        break;
    }
    fetchFiles(
      allAudioLinks,
      allVideoLinks,
      allSpriteLinks,
      allSpriteHdLinks,
      allJsonLinks
    );
    for (const id in allAudioLinks) {
      if (Object.prototype.hasOwnProperty.call(allAudioLinks, id)) {
        global.timeouts[id] = {
          i: 0,
          timeoutId: 0,
          paused: false,
        };
      }
    }
  }
}

async function fetchFiles(
  allAudioLinks: { [key: number]: string },
  allVideoLinks: { [key: number]: string },
  allSpriteLinks: { [key: number]: string },
  allSpriteHdLinks: { [key: number]: string },
  allJsonLinks: { [key: number]: string }
) {
  const audioBuffers: { [key: number]: ArrayBuffer } = {};
  for (const audioId in allAudioLinks) {
    if (Object.prototype.hasOwnProperty.call(allAudioLinks, audioId)) {
      audioBuffers[audioId] = await fetchBuffer(allAudioLinks[audioId]);
    }
  }
  appLoaderStatus.style.width = "25%";
  for (const videoId in allVideoLinks) {
    if (Object.prototype.hasOwnProperty.call(allVideoLinks, videoId)) {
      global.allVideo[videoId] = await fetchUrl(allVideoLinks[videoId]);
    }
  }
  appLoaderStatus.style.width = "50%";
  if (innerWidth < 1024) {
    for (const audioId in allSpriteLinks) {
      if (Object.prototype.hasOwnProperty.call(allSpriteLinks, audioId)) {
        global.allSprites[audioId] = await fetchBlob(allSpriteLinks[audioId]);
      }
    }
    appLoaderStatus.style.width = "75%";
  } else {
    for (const audioId in allSpriteHdLinks) {
      if (Object.prototype.hasOwnProperty.call(allSpriteHdLinks, audioId)) {
        global.allSprites[audioId] = await fetchBlob(allSpriteHdLinks[audioId]);
      }
    }
    appLoaderStatus.style.width = "75%";
  }

  for (const prop in allJsonLinks) {
    if (Object.prototype.hasOwnProperty.call(allJsonLinks, prop)) {
      global.animeFrames[prop] = await fetchJson(allJsonLinks[prop]);
    }
  }
  appLoaderStatus.style.width = "100%";
  appLoader.classList.remove("show");
  playButton.style.display = "flex";
  playButton.addEventListener("click", async () => {
    playButton.classList.add("loading");
    playLoader.classList.add("rotate");
    const audioCtx = new AudioContext();
    for (const songId in audioBuffers) {
      if (Object.prototype.hasOwnProperty.call(audioBuffers, songId)) {
        try {
          global.allAudios[songId] = await decodeAudio(
            audioBuffers[songId],
            songId,
            audioCtx
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
    document.getElementById("home")?.classList.add("hidden");
    playLoader.classList.remove("rotate");
    playButton.classList.remove("loading");
    console.log("events");
    document.body.addEventListener("pointermove", handleMovingSong);
    document.body.addEventListener("pointerup", handleReturnSong);
    document.body.addEventListener("pointercancel", handleReturnSong);
    global.allSongs.forEach((song) =>
      song.addEventListener("pointerdown", handleSelectSong)
    );
  });
}

const handleSelectSong = (ev: PointerEvent) => {
  console.log(ev.target);
  global.currentMovingSong = ev.target as HTMLDivElement;
};
