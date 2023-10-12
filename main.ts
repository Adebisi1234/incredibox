import {
  animate,
  clearAnim,
  isSongInPosition,
  pauseSongs,
  resetSongs,
  resumeSongs,
  startAnim,
} from "./canvas.js";
import { Audios, GlobalState, prop } from "./classes.js";
import { firstTime } from "./uiControl.js";
export const global: GlobalState = new GlobalState();
const appLoader = document.getElementById("app-loader") as HTMLDivElement;
const appLoaderStatus = document.getElementById(
  "app-loader-status"
) as HTMLDivElement;
const playButton = document.getElementById("play-icon") as HTMLDivElement;
const playLoader = document.getElementById("play-loader") as HTMLDivElement;
const video = document.getElementById("video") as HTMLVideoElement;
video.onended = () => {
  video.classList.remove("active");
  if (video.getAttribute("data-video-id")) {
    const audioId = +video.getAttribute("data-video-id")!;
    global.allAudios[20 + audioId].stop();
    video.removeAttribute("data-played");
    resumeSongs();
    global.allVideoPlayers[audioId - 1].classList.remove("loading");
  }
  video.src = "";
};
window.addEventListener("load", () => {
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
    global.allVideoPlayers = [
      ...(document.querySelectorAll(
        ".video-player"
      ) as NodeListOf<HTMLDivElement>),
    ];
    global.allLoaders = [
      ...(document.querySelectorAll(
        ".loader-container > .singers > *"
      ) as NodeListOf<HTMLDivElement>),
    ];
  }
});

const handleMovingSong = (ev: PointerEvent) => {
  if (global.currentMovingSong) {
    global.currentMovingSong.classList.add("active");
    const { left, right, top, bottom } = getMovingSongPosition(ev);
    isSongInPosition(left, right, top, bottom);
    const x = ev.clientX - global.currentMovingSong.offsetLeft;
    const y = ev.clientY - global.currentMovingSong.offsetTop;
    global.currentMovingSong.style.transform = `translate3d(${
      x % innerWidth
    }px, ${y % innerHeight}px, 10px) translate(-50%, -50%) `;
  } else return;
};
const handleReturnSong = (ev: PointerEvent) => {
  if (global.currentMovingSong) {
    global.currentMovingSong.classList.remove("active");
    const { left, right, top, bottom } = getMovingSongPosition(ev);
    const singerId: number = isSongInPosition(left, right, top, bottom);
    if (singerId !== 0 && typeof singerId === "number") {
      const audioId = global.currentMovingSong.getAttribute("data-song-id");
      if (
        audioId &&
        !global.allSingers[singerId - 1].getAttribute("data-song-id")
      ) {
        addAudio(singerId, +audioId);
      } else console.log("audioId error");
      global.currentMovingSong.classList.add("moved");
    }
    global.allSingers.forEach((singer) => {
      singer.classList.remove("over");
    });
    global.currentMovingSong.style.transform = `translate3d(0,0,0) translate(0,0) `;
    global.currentMovingSong = undefined;
  } else return;
};

const addAudio = (singerId: number, audioId: number) => {
  const newAudio = { audio: global.allAudios[audioId], singerId };
  global.allSingers[singerId - 1].setAttribute("data-song-id", `${audioId}`);
  global.audioQueue.push(newAudio);
  mixtape(audioId, "add");
  startAnim(singerId, audioId);
  if (
    Object.keys(global.audiosInDom).length === 0 ||
    global.beatIntervalId === 0
  ) {
    startBeatInterval();
  } else {
    global.allLoaders[singerId - 1].classList.add("loading");
  }
};

export function autoSongs(clear: boolean = false) {
  if (clear) {
    clearInterval(global.autoInterval);
    global.audioQueue = [];
    global.allSongs.forEach((song) => song.classList.remove("disable"));
    return;
  }
  let i = 0;
  let singerIds = [1, 3, 5, 2, 4, 6, 7, 8];
  let singerInt = 0;
  global.allSongs.forEach((song) => song.classList.add("disable"));
  resetSongs();

  setTimeout(() => {}, 500);
  // this is messy I know just a prototype
  global.randomMix[i].forEach((songId) => {
    global.allSingers[singerIds[singerInt] - 1].setAttribute(
      "data-song-id",
      `${songId}`
    );
    global.audioQueue.push({
      audio: global.allAudios[songId],
      singerId: singerIds[singerInt],
    });
    singerInt = (singerInt + 1) % singerIds.length;
  });
  for (let i = 0; i < global.audioQueue.length; i++) {
    const audioObj = global.audioQueue[i];
    global.audioQueue.splice(i, 1);
    global.audiosInDom[audioObj!.audio.id] = audioObj!.audio;
    startAnim(audioObj.singerId, +audioObj.audio.id);
    animate(audioObj.singerId, +audioObj.audio.id);
  }
  i = (i + 1) % global.randomMix.length;
  global.autoInterval = setInterval(() => {
    resetSongs();
    global.randomMix[i].forEach((songId) => {
      global.allSingers[singerIds[singerInt] - 1].setAttribute(
        "data-song-id",
        `${songId}`
      );
      global.audioQueue.push({
        audio: global.allAudios[songId],
        singerId: singerIds[singerInt],
      });
      singerInt = (singerInt + 1) % singerIds.length;
    });
    for (let i = 0; i < global.audioQueue.length; i++) {
      const audioObj = global.audioQueue[i];
      global.audioQueue.splice(i, 1);
      global.audiosInDom[audioObj!.audio.id] = audioObj!.audio;
      startAnim(audioObj.singerId, +audioObj.audio.id);
      animate(audioObj.singerId, +audioObj.audio.id);
    }
    i = (i + 1) % global.randomMix.length;
  }, global.beat * 300);
  console.log(global.autoInterval);
}

const startBeatInterval = (clear: boolean = false) => {
  if (clear) {
    clearInterval(global.beatIntervalId);
    return;
  }
  let i = 0;
  const audioObj = global.audioQueue.pop();
  global.audiosInDom[audioObj!.audio.id] = audioObj!.audio;
  animate(audioObj!.singerId, +audioObj!.audio?.id);

  global.beatIntervalId = setInterval(() => {
    i += 1;
    if (i % 10 === 0) {
      document.documentElement.style.setProperty(
        "--transition-time",
        `${(i % global.beat) / 10}s`
      );
    }
    global.transition = (i % global.beat) * 100;
    if (i % global.beat === 0) {
      global.allLoaders.forEach((loader) => loader.classList.remove("loading"));
      addAudioToDom();
    }
  }, 100);
};

const addAudioToDom = () => {
  for (let i = 0; i < global.audioQueue.length; i++) {
    const audioObj = global.audioQueue[i];
    global.audioQueue.splice(i, 1);
    global.audiosInDom[audioObj!.audio.id] = audioObj!.audio;
    animate(audioObj!.singerId, +audioObj!.audio?.id);
  }
};
function mixtape(id: number, func: "add" | "drop") {
  if (func === "add") {
    global.mix.forEach((mix, i) => {
      if (mix.includes(id) && !global.userMix[i].includes(id)) {
        global.userMix[i].push(id);
        combo(i);
      }
    });
  } else if (func === "drop") {
    global.mix.forEach((mix, i) => {
      if (mix.includes(id) && global.userMix[i].includes(id)) {
        global.userMix[i].splice(id, 1);
        dropCombo(i);
      }
    });
  }
}

function combo(id: number) {
  const classList = global.allVideoPlayers[id].classList;
  switch (true) {
    case classList.contains("combo3") &&
      classList.contains("combo2") &&
      classList.contains("combo1"):
      global.allVideoPlayers[id].classList.add("combo4");
      return;
    case classList.contains("combo2") && classList.contains("combo1"):
      global.allVideoPlayers[id].classList.add("combo3");
      return;
    case classList.contains("combo1"):
      global.allVideoPlayers[id].classList.add("combo2");
      return;
    default:
      global.allVideoPlayers[id].classList.add("combo1");
      break;
  }
}

function dropCombo(id: number) {
  const classList = global.allVideoPlayers[id].classList;
  console.log("dropCombo");
  switch (true) {
    case classList.contains("combo4") &&
      classList.contains("combo3") &&
      classList.contains("combo2") &&
      classList.contains("combo1"):
      global.allVideoPlayers[id].classList.remove("combo4");
      return;
    case classList.contains("combo3") &&
      classList.contains("combo2") &&
      classList.contains("combo1"):
      global.allVideoPlayers[id].classList.remove("combo3");
      return;
    case classList.contains("combo2") && classList.contains("combo1"):
      global.allVideoPlayers[id].classList.remove("combo2");
      return;
    default:
      global.allVideoPlayers[id].classList.remove("combo1");
      break;
  }
}

function getMovingSongPosition(ev: PointerEvent) {
  const position: { left: number; top: number; right: number; bottom: number } =
    { left: 0, top: 0, right: 0, bottom: 0 };
  position.left = ev.clientX;
  position.right = position.left + global.currentMovingSong!.offsetWidth / 2; // taking Translate(-50%, -50%) above into account
  position.top = ev.clientY;
  position.bottom = position.top + global.currentMovingSong!.offsetHeight / 2; // taking Translate(-50%, -50%) above into account
  return position;
}

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

async function decodeAudio(
  buffer: ArrayBuffer,
  id: string,
  audioCtx: AudioContext
) {
  return new Audios(await audioCtx.decodeAudioData(buffer), id);
}

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
      // There has to be a better way HATE THE HARD-CODE
      case 1:
        global.beat = 53; //100ms
        global.randomMix = [
          [2, 4, 6],
          [1, 14, 18],
          [12, 18, 20],
          [1, 2, 3, 9, 11, 16],
          [1, 3, 8, 13, 15, 18],
          [6, 10, 14, 16, 20],
          [2, 3, 4, 10, 20],
        ];
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
        global.beat = 96;
        global.randomMix = [
          [2, 4],
          [2, 5, 9, 11, 17, 18],
          [2, 8, 9],
          [6, 13, 17],
          [2, 5, 9, 10, 15, 16],
          [7, 9, 14, 16, 17, 19, 20],
          [1, 2, 3, 8, 11, 15],
        ];
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
          1:
            innerWidth < 1000
              ? "/public/v2/videos/video1.webm"
              : "/public/v2/videos/video1-hd.webm",
          2:
            innerWidth < 1000
              ? "/public/v2/videos/video2.webm"
              : "/public/v2/videos/video2-hd.webm",
          3:
            innerWidth < 1000
              ? "/public/v2/videos/video3.webm"
              : "/public/v2/videos/video3-hd.webm",
        };

        break;
      case 3:
        global.beat = 80;
        global.randomMix = [
          [2, 4, 9, 14, 16],
          [1, 5, 7, 14, 19],
          [1, 5, 7, 9, 10, 11, 19],
          [1, 5, 6, 7, 9, 11, 12],
          [3, 4, 8, 17],
          [4, 7, 11],
        ];
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
          1:
            innerWidth < 1000
              ? "/public/v3/videos/video1.webm"
              : "/public/v3/videos/video1-hd.webm",
          2:
            innerWidth < 1000
              ? "/public/v3/videos/video2.webm"
              : "/public/v3/videos/video2-hd.webm",
          3:
            innerWidth < 1000
              ? "/public/v3/videos/video3.webm"
              : "/public/v3/videos/video3-hd.webm",
        };
        break;
      case 4:
        global.beat = 80;
        global.randomMix = [
          [3, 4, 8, 17],
          [4, 7, 11],
          [1, 4, 7, 9, 11, 12],
          [1, 5, 9, 12, 14, 15, 19],
        ];
        // See why I hate HARD-CODE too lazy to fix it now tho til v1.2
        allAudioLinks = {
          16: "/public/v4/audios/chips1_feel.ogg",
          17: "/public/v4/audios/chips2_chillin.ogg",
          18: "/public/v4/audios/chips3_yeah.ogg",
          19: "/public/v4/audios/chips4_filback.ogg",
          20: "/public/v4/audios/chips5_teylo.ogg",
          1: "/public/v4/audios/drum1_kick.ogg",
          2: "/public/v4/audios/drum2_snare.ogg",
          3: "/public/v4/audios/drum3_touti.ogg",
          4: "/public/v4/audios/drum4_charley.ogg",
          5: "/public/v4/audios/drum5_chatom.ogg",
          6: "/public/v4/audios/effect1_bass.ogg",
          7: "/public/v4/audios/effect2_enigmatic.ogg",
          8: "/public/v4/audios/effect3_cry.ogg",
          9: "/public/v4/audios/effect4_odoyouno.ogg",
          10: "/public/v4/audios/effect5_oua.ogg",
          11: "/public/v4/audios/melo1_toun.ogg",
          12: "/public/v4/audios/melo2_flute.ogg",
          13: "/public/v4/audios/melo3_neou.ogg",
          14: "/public/v4/audios/melo4_hu.ogg",
          15: "/public/v4/audios/melo5_ah.ogg",
          21: "/public/v4/audios/21_bonus.ogg",
          22: "/public/v4/audios/22_bonus.ogg",
          23: "/public/v4/audios/23_bonus.ogg",
        };
        allSpriteLinks = {
          16: "/public/v4/sprites/chips1_feel-sprite.png",
          17: "/public/v4/sprites/chips2_chillin-sprite.png",
          18: "/public/v4/sprites/chips3_yeah-sprite.png",
          19: "/public/v4/sprites/chips4_filback-sprite.png",
          20: "/public/v4/sprites/chips5_teylo-sprite.png",
          1: "/public/v4/sprites/drum1_kick-sprite.png",
          2: "/public/v4/sprites/drum2_snare-sprite.png",
          3: "/public/v4/sprites/drum3_touti-sprite.png",
          4: "/public/v4/sprites/drum4_charley-sprite.png",
          5: "/public/v4/sprites/drum5_chatom-sprite.png",
          6: "/public/v4/sprites/effect1_bass-sprite.png",
          7: "/public/v4/sprites/effect2_enigmatic-sprite.png",
          8: "/public/v4/sprites/effect3_cry-sprite.png",
          9: "/public/v4/sprites/effect4_odoyouno-sprite.png",
          10: "/public/v4/sprites/effect5_oua-sprite.png",
          11: "/public/v4/sprites/melo1_toun-sprite.png",
          12: "/public/v4/sprites/melo2_flute-sprite.png",
          13: "/public/v4/sprites/melo3_neou-sprite.png",
          14: "/public/v4/sprites/melo4_hu-sprite.png",
          15: "/public/v4/sprites/melo5_ah-sprite.png",
        };
        allSpriteHdLinks = {
          16: "/public/v4/sprites/chips1_feel-sprite-hd.png",
          17: "/public/v4/sprites/chips2_chillin-sprite-hd.png",
          18: "/public/v4/sprites/chips3_yeah-sprite-hd.png",
          19: "/public/v4/sprites/chips4_filback-sprite-hd.png",
          20: "/public/v4/sprites/chips5_teylo-sprite-hd.png",
          1: "/public/v4/sprites/drum1_kick-sprite-hd.png",
          2: "/public/v4/sprites/drum2_snare-sprite-hd.png",
          3: "/public/v4/sprites/drum3_touti-sprite-hd.png",
          4: "/public/v4/sprites/drum4_charley-sprite-hd.png",
          5: "/public/v4/sprites/drum5_chatom-sprite-hd.png",
          6: "/public/v4/sprites/effect1_bass-sprite-hd.png",
          7: "/public/v4/sprites/effect2_enigmatic-sprite-hd.png",
          8: "/public/v4/sprites/effect3_cry-sprite-hd.png",
          9: "/public/v4/sprites/effect4_odoyouno-sprite-hd.png",
          10: "/public/v4/sprites/effect5_oua-sprite-hd.png",
          11: "/public/v4/sprites/melo1_toun-sprite-hd.png",
          12: "/public/v4/sprites/melo2_flute-sprite-hd.png",
          13: "/public/v4/sprites/melo3_neou-sprite-hd.png",
          14: "/public/v4/sprites/melo4_hu-sprite-hd.png",
          15: "/public/v4/sprites/melo5_ah-sprite-hd.png",
        };
        allJsonLinks = {
          16: "/public/v4/json/chips1_feel.json",
          17: "/public/v4/json/chips2_chillin.json",
          18: "/public/v4/json/chips3_yeah.json",
          19: "/public/v4/json/chips4_filback.json",
          20: "/public/v4/json/chips5_teylo.json",
          1: "/public/v4/json/drum1_kick.json",
          2: "/public/v4/json/drum2_snare.json",
          3: "/public/v4/json/drum3_touti.json",
          4: "/public/v4/json/drum4_charley.json",
          5: "/public/v4/json/drum5_chatom.json",
          6: "/public/v4/json/effect1_bass.json",
          7: "/public/v4/json/effect2_enigmatic.json",
          8: "/public/v4/json/effect3_cry.json",
          9: "/public/v4/json/effect4_odoyouno.json",
          10: "/public/v4/json/effect5_oua.json",
          11: "/public/v4/json/melo1_toun.json",
          12: "/public/v4/json/melo2_flute.json",
          13: "/public/v4/json/melo3_neou.json",
          14: "/public/v4/json/melo4_hu.json",
          15: "/public/v4/json/melo5_ah.json",
        };
        allVideoLinks = {
          1:
            innerWidth < 1000
              ? "/public/v4/videos/video1.webm"
              : "/public/v4/videos/video1-hd.webm",
          2:
            innerWidth < 1000
              ? "/public/v4/videos/video2.webm"
              : "/public/v4/videos/video2-hd.webm",
          3:
            innerWidth < 1000
              ? "/public/v4/videos/video3.webm"
              : "/public/v4/videos/video3-hd.webm",
        };

        break;
      case 5:
        global.beat = 80;
        global.randomMix = [
          [3, 7, 10],
          [3, 4, 7, 10, 15, 18],
          [2, 3, 4, 10, 18],
          [2, 4, 6, 7, 11, 18],
          [7, 8, 10, 11, 14, 15, 16],
        ];
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
          1:
            innerWidth < 1000
              ? "/public/v5/videos/video1.webm"
              : "/public/v5/videos/video1-hd.webm",
          2:
            innerWidth < 1000
              ? "/public/v5/videos/video2.webm"
              : "/public/v5/videos/video2-hd.webm",
          3:
            innerWidth < 1000
              ? "/public/v5/videos/video3.webm"
              : "/public/v5/videos/video3-hd.webm",
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
        global.beat = 71;
        global.randomMix = [
          [4, 10],
          [1, 4, 5, 9, 10, 19, 20],
          [4, 8, 9, 16, 19],
          [9, 11, 14, 15, 16],
        ];
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
          1:
            innerWidth < 1000
              ? "/public/v6/videos/video1.webm"
              : "/public/v6/videos/video1-hd.webm",
          2:
            innerWidth < 1000
              ? "/public/v6/videos/video2.webm"
              : "/public/v6/videos/video2-hd.webm",
          3:
            innerWidth < 1000
              ? "/public/v6/videos/video3.webm"
              : "/public/v6/videos/video3-hd.webm",
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
        global.beat = 68;
        global.randomMix = [
          [5, 6, 7, 11, 14, 16],
          [4, 5, 6, 7, 14],
          [3, 4, 6, 10, 17],
          [3, 4, 6, 10, 15, 17],
          [2, 6, 9, 13, 15],
        ];
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
          1:
            innerWidth < 1000
              ? "/public/v7/videos/video1.webm"
              : "/public/v7/videos/video1-hd.webm",
          2:
            innerWidth < 1000
              ? "/public/v7/videos/video2.webm"
              : "/public/v7/videos/video2-hd.webm",
          3:
            innerWidth < 1000
              ? "/public/v7/videos/video3.webm"
              : "/public/v7/videos/video3-hd.webm",
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
        global.beat = 68;
        global.randomMix = [
          [2, 12, 13, 14, 16],
          [2, 6, 12, 14, 16, 17, 19],
          [10, 15, 19],
          [4, 8, 10, 14, 15, 18],
          [4, 8, 13, 14, 18],
        ];
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
          1:
            innerWidth < 1000
              ? "/public/v8/videos/video1.webm"
              : "/public/v8/videos/video1-hd.webm",
          2:
            innerWidth < 1000
              ? "/public/v8/videos/video2.webm"
              : "/public/v8/videos/video2-hd.webm",
          3:
            innerWidth < 1000
              ? "/public/v8/videos/video3.webm"
              : "/public/v8/videos/video3-hd.webm",
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
        global.beat = 50;
        global.randomMix = [
          [2, 6, 9],
          [2, 6, 9, 11, 12, 17],
          [1, 4, 5, 6, 17, 18],
          [1, 3, 5, 7, 9],
          [13, 14, 15, 19, 20, 16],
        ];
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
          1:
            innerWidth < 1000
              ? "/public/v9/videos/video1.webm"
              : "/public/v9/videos/video1-hd.webm",
          2:
            innerWidth < 1000
              ? "/public/v9/videos/video2.webm"
              : "/public/v9/videos/video2-hd.webm",
          3:
            innerWidth < 1000
              ? "/public/v9/videos/video3.webm"
              : "/public/v9/videos/video3-hd.webm",
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
          clear: false,
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
    localStorage.getItem("firsttime") ?? firstTime();
    document.body.addEventListener("pointermove", handleMovingSong);
    document.body.addEventListener("pointerup", handleReturnSong);
    global.allSongs.forEach((song) =>
      song.addEventListener("pointerdown", handleSelectSong)
    );
    global.allSingers.forEach((singer) => {
      singer.addEventListener("click", handlePauseSong);
      singer.addEventListener("pointerdown", handleDropSong);
    });
    global.allVideoPlayers.forEach((videoPlayer) => {
      videoPlayer.addEventListener("click", handleStartVideo);
    });
  });
}

const handlePauseSong = (ev: MouseEvent) => {
  const songId: string | null = (ev.target as HTMLDivElement).getAttribute(
    "data-song-id"
  );
  if (songId && (ev.target as HTMLDivElement).classList.contains("singer")) {
    if (global.audiosInDom[songId].isMute() === 1) {
      global.timeouts[songId].paused = true;
      global.audiosInDom[songId].muteSound();
      (ev.target as HTMLDivElement).classList.remove("active");
    } else if (global.audiosInDom[songId].isMute() === 0) {
      global.timeouts[songId].paused = false;
      global.audiosInDom[songId].unmuteSound();
      (ev.target as HTMLDivElement).classList.add("active");
    }
  } else return;
};

const handleSelectSong = (ev: PointerEvent) => {
  if (!(ev.target as HTMLDivElement).classList.contains("moved")) {
    global.currentMovingSong = ev.target as HTMLDivElement;
  }
};

function handleStartVideo(ev: MouseEvent) {
  const target = ev.target as HTMLDivElement;
  const videoId: string | null = target.getAttribute("data-player-id");
  if (video.getAttribute("data-played")) return;
  if (!target.classList.contains("combo4")) {
    if (videoId) {
      global.allSongs.forEach((song) => {
        if (
          !(
            song.getAttribute("data-song-id") &&
            global.mix[+videoId - 1].includes(
              +song.getAttribute("data-song-id")!
            )
          )
        ) {
          song.classList.add("disable");
        }
      });
      setTimeout(() => {
        global.allSongs.forEach((song) => {
          song.classList.remove("disable");
        });
      }, 500);
    }
    return;
  }
  video.src = global.allVideo[+videoId!];
  target.classList.add("loading");
  setTimeout(() => {
    const audioId = +target.getAttribute("data-player-id")!;
    pauseSongs();
    video.classList.add("active");
    video.setAttribute("data-video-id", `${audioId}`);

    video.play();
    video.setAttribute("data-played", "true");
    global.allAudios[20 + audioId].play();
  }, global.transition);
}

const handleDropSong = (ev: PointerEvent) => {
  let throttle = 0;
  const target = ev.target as HTMLDivElement;
  const songId = target.getAttribute("data-song-id");
  if (!songId) return;
  const downTop = ev.clientY;
  const downleft = target.getBoundingClientRect().left;
  const downright = target.getBoundingClientRect().right;
  const downbottom = target.getBoundingClientRect().bottom;
  target.addEventListener("pointerup", (ev: PointerEvent) => {
    const left = ev.clientX;
    const top = ev.clientY;
    if (
      downTop <= top &&
      top - downTop >= 50 &&
      downleft < left &&
      downright > left &&
      downbottom > top &&
      throttle === 0
    ) {
      console.log("Clear animation");
      clearAnim(+target.id, +songId);
      mixtape(+songId, "drop");
      if (Object.keys(global.audiosInDom).length === 0) {
        startBeatInterval(true);
      }
    }
    throttle++;
  });
};
