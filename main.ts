import { GlobalState } from "./classes.js";

export const global: GlobalState = new GlobalState();
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
    startApplication(global.version);
  }
};

function startApplication(version: number) {
  if (version === 0) {
    console.log("error game version shouldn't be zero");
  }

  switch (version) {
    case 1:
      break;
    case 2:
      break;

    case 3:
      break;
    case 4:
      break;

    case 5:
      break;
    case 6:
      break;

    case 7:
      break;
    case 8:
      const allAudioLinks = {
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
      const allVideoLinks = {
        1: "/public/v8/videos/video1.webm",
        2: "/public/v8/videos/video2.webm",
        3: "/public/v8/videos/video3.webm",
      };
      const allSpriteLinks = {
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
      const allSpriteHdLinks = {
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
      const allJsonLinks = {
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
      fetchFiles(
        allAudioLinks,
        allVideoLinks,
        allSpriteLinks,
        allSpriteHdLinks,
        allJsonLinks
      );
      break;

    case 9:
      break;
  }
}

async function fetchFiles(
  allAudioLinks: { [key: number]: string },
  allVideoLinks: { [key: number]: string },
  allSpriteLinks: { [key: number]: string },
  allSpriteHdLinks: { [key: number]: string },
  allJsonLinks: { [key: number]: string }
) {
  const audioBlobs: { [key: number]: Blob } = {};
  for (const audioId in allAudioLinks) {
    if (Object.prototype.hasOwnProperty.call(allAudioLinks, audioId)) {
      audioBlobs[audioId] = await fetchBlob(allAudioLinks[audioId]);
    }
  }
  for (const videoId in allVideoLinks) {
    if (Object.prototype.hasOwnProperty.call(allVideoLinks, videoId)) {
      global.allVideo[videoId] = await fetchUrl(allVideoLinks[videoId]);
    }
  }
  if (innerWidth < 1024) {
    for (const audioId in allSpriteLinks) {
      if (Object.prototype.hasOwnProperty.call(allSpriteLinks, audioId)) {
        global.allSprites[audioId] = await fetchBlob(allSpriteLinks[audioId]);
      }
    }
  } else {
    for (const audioId in allSpriteHdLinks) {
      if (Object.prototype.hasOwnProperty.call(allSpriteHdLinks, audioId)) {
        global.allSprites[audioId] = await fetchBlob(allSpriteHdLinks[audioId]);
      }
    }
  }
}
// // I PITY WHOEVER GOES THROUGH THIS CODE
// import { GlobalState, Audios, json, oldJson } from "./classes.js";
// // Constants
// const audioCtx = new AudioContext();
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

// function getMovingSongPosition(ev: PointerEvent) {
//   const position: { left: number; top: number; right: number; bottom: number } =
//     { left: 0, top: 0, right: 0, bottom: 0 };
//   position.left = ev.clientX;
//   position.right = position.left + currentMovingSong!.offsetWidth / 2; // taking Translate(-50%, -50%) above into account
//   position.top = ev.clientY;
//   position.bottom = position.top + currentMovingSong!.offsetHeight / 2; // taking Translate(-50%, -50%) above into account
//   return position;
// }
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
async function fetchUrl(link: string): Promise<string> {
  try {
    const response = await (await fetch(link)).blob();
    return URL.createObjectURL(response);
  } catch (err) {
    throw new Error("Invalid URL");
  }
}
// async function fetchJson(link: string): Promise<json> {
//   try {
//     const response: oldJson = await (await fetch(link)).json();
//     const edit: json = {
//       ...response,
//       arrayFrame: response.arrayFrame.map(({ prop }) => {
//         let x: string | number = prop.split(",")[0];
//         x = +x;
//         let y: string | number = prop.split(",")[1];
//         y = +y;
//         let translateX: string | number = prop.split(",")[2];
//         translateX = +translateX;
//         let translateY: string | number = prop.split(",")[3];
//         translateY = +translateY;
//         return { prop: [x, y, translateX, translateY] };
//       }),
//     };
//     return edit;
//   } catch (err) {
//     throw new Error("Invalid URL");
//   }
// }

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

// async function decodeAudio(audioLink: string, id: string) {
//   const buffer = (await fetch(audioLink)).arrayBuffer();
//   return new Audios(await audioCtx.decodeAudioData(await buffer), id);
// }

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
