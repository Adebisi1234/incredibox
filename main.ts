// Constants
class GlobalState {
  private ready = false;
  private audioQueue: HTMLAudioElement[] = [];
  readonly beat: number = 7;
  private interval: number = 1000;
  public counter: number = 0;
  public beatIntervalId: number = 0;
  private audiosInDom: { [key: number]: HTMLAudioElement } = {};

  constructor(beat?: number, interval?: number) {
    if (beat && interval) {
      this.beat = beat;
      this.interval = interval;
    }
  }
  get getInterval() {
    return this.interval;
  }
  get getAudiosInDom() {
    return this.audiosInDom;
  }
  set setAudiosInDom({ id, audio }: { id: number; audio: HTMLAudioElement }) {
    this.audiosInDom[id] = audio;
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
const movedSongs: HTMLDivElement[] = []; //May removed this and reference audiosInDom instead
let currentMovingSong: HTMLDivElement | undefined = undefined; // May make use of the data-song-id instead later
const stage: HTMLElement = document.querySelector("main")!;
const songs: NodeListOf<HTMLDivElement> = document.querySelectorAll(".songs");
const singers: NodeListOf<HTMLDivElement> =
  document.querySelectorAll(".singer");
// Resize controller

const singerObj: {
  left: number;
  right: number;
  top: number;
  bottom: number;
  element: HTMLDivElement;
}[] = [];

//
// Fetch all audio's and videos beforehand
const allVideoLinks: { [key: number]: string } = {
  1: "./public/video1.webm",
  2: "./public/video2.webm",
  3: "./public/video3.webm",
};

const allAudioLinks: { [key: number]: string } = {
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

const allSpriteLinks = (function getAllSpriteLinks(allAudioLinks: {
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
})(allAudioLinks);

const allCachedAudioURL: {
  [key: number]: string;
} = {};
const allCachedVideoURL: {
  [key: number]: string;
} = {};
const allCachedSpriteURL: {
  [key: number]: string;
} = {};

// fetch blog helper function
async function fetchBlob(audioLink: string): Promise<Blob> {
  try {
    const response = await (await fetch(audioLink)).blob();
    return response;
  } catch (err) {
    throw new Error("Invalid URL");
  }
}

singers.forEach((singer) => {
  singer.addEventListener("click", handlePauseAudio);
});

// dragging songs
songs.forEach((song) => {
  song.addEventListener("pointerdown", handleSongPointerDown);
  song.addEventListener("pointerup", handleDropSong);
});

for (let i = 0; i < singers.length; i++) {
  singerObj[i] = {
    left: singers[i].offsetLeft,
    right: singers[i].offsetWidth + singers[i].offsetLeft,
    top: singers[i].offsetTop,
    bottom: singers[i].offsetTop + singers[i].offsetHeight,
    element: singers[i],
  };
}

// Event handlers
function handlePauseAudio(ev: MouseEvent) {
  const element: HTMLDivElement = (
    ev.target as HTMLDivElement
  ).classList.contains("frame")
    ? ((ev.target as HTMLDivElement).parentElement as HTMLDivElement)
    : (ev.target as HTMLDivElement);

  const audioId = element.getAttribute("data-song-id");
  if (!audioId) {
    return;
  } else {
    console.log(audioId);
    const audio: HTMLAudioElement | null = document.querySelector(
      `audio[data-song-id='${audioId}']`
    );
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
  if (!currentMovingSong || movedSongs.includes(currentMovingSong)) {
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
    singerObj.forEach((singer) => {
      if (
        singer.left < left &&
        right < singer.right &&
        singer.top < top &&
        bottom < singer.bottom
      ) {
        const id = currentMovingSong!.getAttribute("data-song-id")!;
        const singerId =
          singer.element.firstElementChild!.getAttribute("data-singer-id");
        singer.element.style.opacity = "1";
        singer.element.setAttribute(
          "data-song-id",
          currentMovingSong!.getAttribute("data-song-id")!
        );
        singer.element.classList.add("singing");
        document.documentElement.style.setProperty(
          `--background-${singerId}`,
          `url(${allCachedSpriteURL[+id]})`
        );
        addAudio(id);
        movedSongs.push(currentMovingSong!);
        currentMovingSong!.style.transform = `translate3d(0px, 0px, 0px)`;
        currentMovingSong = undefined;
      }
    });
    if (currentMovingSong) {
      currentMovingSong!.style.transform = `translate3d(0px, 0px, 0px)`;
      currentMovingSong.style.opacity = "1";
      currentMovingSong = undefined;
    }
    singers.forEach((singer) => singer.classList.remove("active"));
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
    const left = currentMovingSong.offsetLeft + x;
    const right = left + currentMovingSong.offsetWidth / 2; // taking Translate(-50%, -50%) above into account
    const top = currentMovingSong.offsetTop + y;
    const bottom = top + currentMovingSong.offsetHeight / 2;
    // Highlighting the hovered singer
    singers.forEach((singer) => singer.classList.add("active"));
    singerObj.forEach((singer) => {
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
function handleSingerClick(ev: MouseEvent): void {
  // console.log(ev);
}
function handleSingerPointerDown(ev: PointerEvent): void {
  // console.log(ev);
}

// customizing the singers

// Playing video

// adding & Playing audio

function addAudio(id: string) {
  const newAudio = document.createElement("audio");
  newAudio.setAttribute("data-song-id", id);
  newAudio.loop = true;
  newAudio.src = allCachedAudioURL[Number(id)];
  if (Object.keys(global.getAudiosInDom).length === 0) {
    document.body.append(newAudio);
    newAudio.play();
    startBeatInterval();
    global.setAudiosInDom = { id: +id, audio: newAudio };
  } else {
    global.setAudioQueue = newAudio;
    global.setAudiosInDom = { id: +id, audio: newAudio };
  }
}

// Beat
function startBeatInterval() {
  global.beatIntervalId = setInterval(() => {
    global.counter += 1;
    if (global.counter % global.beat === 0) {
      global.getAudioQueue.forEach((audio, i) => {
        audio.paused && audio.play();
        global.getAudioQueue.splice(i, 1);
      });
      console.log("played?");
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
      allCachedAudioURL[audioLink] = URL.createObjectURL(audioBlob);
    }
    for (const videoLink in allVideoLinks) {
      const videoBlob = await fetchBlob(allVideoLinks[videoLink]);
      allCachedVideoURL[videoLink] = URL.createObjectURL(videoBlob);
    }
    for (const spriteLink in allSpriteLinks) {
      const spriteBlob = await fetchBlob(allSpriteLinks[spriteLink]);
      allCachedSpriteURL[spriteLink] = URL.createObjectURL(spriteBlob);
    }
    global.isLoading = false;
  } catch (err) {
    throw new Error();
  }
}

// Start application
cacheFilesURL(allAudioLinks, allVideoLinks, allSpriteLinks).then(() => {
  if (global.isReady) {
    (
      document.getElementsByClassName("splashscreen")[0] as HTMLDivElement
    ).style.display = "none";
  }
});
