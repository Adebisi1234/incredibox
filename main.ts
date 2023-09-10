// Constants
class GlobalState {
  private ready = false;
  private audioQueue: HTMLAudioElement[] = [];
  readonly beat: number = 7;
  private interval: number = 1000;
  public counter: number = 0;
  public beatIntervalId: number = 0;
  private audiosInDom: { [key: number]: HTMLAudioElement } = {};
  private allSingers: NodeListOf<HTMLDivElement> =
    document.querySelectorAll(".singer");
  private singersPosition: {
    left: number;
    right: number;
    top: number;
    bottom: number;
    element: HTMLDivElement;
  }[] = [];
  private allSongs: NodeListOf<HTMLDivElement> =
    document.querySelectorAll(".song");

  private _allVideoLinks: { [key: number]: string } = {
    1: "./public/video1.webm",
    2: "./public/video2.webm",
    3: "./public/video3.webm",
  };

  private _allAudioLinks: { [key: number]: string } = {
    1: "./public/1_atlanta.ogg",
    2: "./public/2_tuctom.ogg",
    3: "./public/3_foubreak.ogg",
    4: "./public/4_koukaki.ogg",
    5: "./public/5_koungou.ogg",
    6: "./public/6_bass.ogg",
    7: "./public/7_monk.ogg",
    8: "./public/8_sonar.ogg",
    9: "./public/9_souffle.ogg",
    10: "./public/10_epifle.ogg",
    11: "./public/11_arpeg.ogg",
    12: "./public/12_tromp.ogg",
    13: "./public/13_pizzi.ogg",
    14: "./public/14_organ.ogg",
    15: "./public/15_synth.ogg",
    16: "./public/16_follow.ogg",
    17: "./public/17_choir.ogg",
    18: "./public/18_houhou.ogg",
    19: "./public/19_reach.ogg",
    20: "./public/20_believe.ogg",
  };

  private _allSpriteLinks = (function getAllSpriteLinks(allAudioLinks: {
    [key: number]: string;
  }) {
    const spriteUrls: {
      [key: number]: string;
    } = {};
    for (const id in allAudioLinks) {
      if (Object.prototype.hasOwnProperty.call(allAudioLinks, id)) {
        let url = allAudioLinks[id];
        let baseUrl =
          "/anime/" + url.split("/")[2].replace(".ogg", "-sprite-hd.png");
        spriteUrls[id] = baseUrl;
      }
    }
    return spriteUrls;
  })(this._allAudioLinks);
  // Objects for cached urls
  public allCachedAudioURL: {
    [key: number]: string;
  } = {};
  public allCachedVideoURL: {
    [key: number]: string;
  } = {};
  public allCachedSpriteURL: {
    [key: number]: string;
  } = {};

  constructor(beat?: number, interval?: number) {
    if (beat && interval) {
      this.beat = beat;
      this.interval = interval;
    }
  }

  get allVideoLinks() {
    return this._allVideoLinks;
  }
  get allAudioLinks() {
    return this._allAudioLinks;
  }
  get allSpriteLinks() {
    return this._allSpriteLinks;
  }
  get getInterval() {
    return this.interval;
  }
  get songs() {
    return this.allSongs;
  }
  get singers() {
    return this.allSingers;
  }

  set setSingers(singers: NodeListOf<HTMLDivElement>) {
    this.allSingers = singers;
    this.singers.forEach((singer, i) => {
      this.singersPosition[i] = {
        left: singer.offsetLeft,
        right: singer.offsetWidth + singer.offsetLeft,
        top: singer.offsetTop,
        bottom: singer.offsetTop + singer.offsetHeight,
        element: singer,
      };
    });
  }

  get singersPost() {
    return this.singersPosition;
  }

  get getAudiosInDom() {
    return this.audiosInDom;
  }
  set setAudiosInDom({ id, audio }: { id: number; audio: HTMLAudioElement }) {
    this.audiosInDom[id] = audio;
  }
  set removeAudioFromDom(id: number) {
    const audio = this.audiosInDom[id];
    audio.pause;
    audio.src = "";
    audio.remove();
    delete this.audiosInDom[id];
  }
  get isReady() {
    return this.ready;
  }

  set isLoading(loading: boolean) {
    this.ready = !loading;
  }

  get getAudioQueue() {
    return this.audioQueue;
  }
  set setAudioQueue(newAudio: HTMLAudioElement) {
    this.audioQueue.push(newAudio);
  }
}
const global = new GlobalState();
window.addEventListener("DOMContentLoaded", () => {
  global.setSingers = document.querySelectorAll(".singer");
});
let currentMovingSong: HTMLDivElement | undefined = undefined; // May make use of the data-song-id instead later
const stage: HTMLElement = document.querySelector("main")!;
// const urls

// fetch blog helper function
async function fetchBlob(audioLink: string): Promise<Blob> {
  try {
    const response = await (await fetch(audioLink)).blob();
    return response;
  } catch (err) {
    throw new Error("Invalid URL");
  }
}

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

function getTarget(ev: Event) {
  return (ev.target as HTMLDivElement).classList.contains("frame")
    ? ((ev.target as HTMLDivElement).parentElement as HTMLDivElement)
    : (ev.target as HTMLDivElement);
}
// Event handlers
window.addEventListener("resize", () => {
  global.setSingers = document.querySelectorAll(".singer");
});

function handlePauseAudio(ev: MouseEvent) {
  const element: HTMLDivElement = getTarget(ev);

  const audioId = element.getAttribute("data-song-id");
  if (!audioId) {
    return;
  } else {
    const audio: HTMLAudioElement = global.getAudiosInDom[+audioId];
    if (audio) {
      if (!audio?.muted) {
        audio.muted = true;
        element.style.opacity = "0.6";
      } else {
        audio.muted = false;
        element.style.opacity = "1";
      }
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
  const newAudio = document.createElement("audio");
  newAudio.setAttribute("data-song-id", id);
  newAudio.loop = true;
  newAudio.src = global.allCachedAudioURL[+id];
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
        audio.paused && audio.play();
        document
          .querySelector(
            `.singer[data-song-id="${audio.getAttribute("data-song-id")}"]`
          )!
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
async function cacheFilesURL(
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
      const audioBlob = await fetchBlob(allAudioLinks[audioLink]);
      global.allCachedAudioURL[audioLink] = URL.createObjectURL(audioBlob);
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
cacheFilesURL(
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
