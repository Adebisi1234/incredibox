class GlobalState {
  private ready = false;
  private audioQueue: HTMLAudioElement[] = [];
  readonly beat: number = 7;
  private interval: number = 1000;
  private counter: number = 0;
  public beatIntervalId: number = 0;
  private audiosInDom: { [key: number]: HTMLAudioElement } = {};

  constructor(beat?: number, interval?: number) {
    if (beat && interval) {
      this.beat = beat;
      this.interval = interval;
    }
  }
  get getCounter() {
    return this.counter;
  }
  set setCounter(num: number) {
    this.counter += num;
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

// Resize controller

window.addEventListener("resize", (ev: UIEvent) => {
  if (innerWidth < 768) {
    // Change orientation
  }
});

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
const allCachedAudioURL: {
  [key: number]: string;
} = {};
const allCachedVideoURL: {
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

// Fetch all audio and video files into memory
async function cacheFilesURL(
  allAudioLinks: {
    [key: number]: string;
  },
  allVideoLinks: {
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
    global.isLoading = false;
  } catch (err) {
    throw new Error();
  }
}

// dragging songs
const songs: NodeListOf<HTMLDivElement> = document.querySelectorAll(".songs");
songs.forEach((song) => {
  song.addEventListener("pointerdown", handleSongPointerDown);
  song.addEventListener("pointerup", handleSongPointerUp);
});

const singers: NodeListOf<HTMLDivElement> =
  document.querySelectorAll(".singer");

const stage: HTMLElement = document.querySelector("main")!;

// Event handlers
// Buttons

// Testing
const movedSongs: HTMLDivElement[] = []; //May removed this and reference audiosInDom instead
let currentMovingSong: HTMLDivElement | undefined = undefined; // May make use of the data-song-id instead later

function handleSongPointerDown(ev: PointerEvent): void {
  // console.log("song pointer down");
  console.log(ev.target);
  const container =
    (ev.target as HTMLDivElement).classList.contains("left") ||
    (ev.target as HTMLDivElement).classList.contains("right");
  currentMovingSong = container ? undefined : (ev.target as HTMLDivElement);
  if (!currentMovingSong || movedSongs.includes(currentMovingSong)) {
    currentMovingSong = undefined;
  }
  stage.addEventListener("pointerover", handleStagePointerMove);
  document.body.addEventListener("pointermove", handleBodyPointerMove);
  document.body.addEventListener("pointerup", handleSongPointerUp);
  document.body.addEventListener("pointercancel", handleSongPointerUp);
  // singers.forEach((singer) => {
  //   singer.addEventListener("pointerover", handleSingerPointerOver);
  //   singer.addEventListener("pointerleave", handleSingerPointerLeave);
  // });
}
function handleSongPointerUp(ev: PointerEvent): void {
  console.log("song / body pointer up");
  if (currentMovingSong) {
    currentMovingSong!.style.transform = `translate3d(0px, 0px, 0px)`;
    movedSongs.push(currentMovingSong);
    currentMovingSong = undefined;
  }
  document.body.removeEventListener("pointermove", handleBodyPointerMove);
  document.body.removeEventListener("pointercancel", handleSongPointerUp);
  stage.removeEventListener("pointerover", handleStagePointerMove);
  // singers.forEach((singer) => {
  //   // singer.removeEventListener("pointerover", handleSingerPointerOver);
  //   singer.removeEventListener("pointerleave", handleSingerPointerLeave);
  // });
}
function handleBodyPointerMove(ev: PointerEvent): void {
  if (currentMovingSong) {
    currentMovingSong.style.opacity = "0.5";
    currentMovingSong.style.transformOrigin = "center";
    currentMovingSong.style.transform = `translate3d(${
      ev.clientX - currentMovingSong.offsetLeft
    }px, ${
      ev.clientY - currentMovingSong.offsetTop
    }px, 10px) translate(-50%, -50%) `;
  }
}
// Main stage
function handleStagePointerMove(ev: PointerEvent): void {
  console.log(ev);
  if (
    currentMovingSong &&
    ((ev.target as HTMLDivElement).classList.contains("frame") ||
      (ev.target as HTMLDivElement).classList.contains("singers"))
  ) {
    console.log("enter singer");
    (ev.target as HTMLDivElement).classList.add("entered");
  }
}
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

function startBeatInterval() {
  global.beatIntervalId = setInterval(() => {
    global.setCounter += 1;
    if (global.getCounter % global.beat === 0) {
      global.getAudioQueue.forEach((audio, i) => {
        audio.paused && audio.play();
        global.getAudioQueue.splice(i, 1);
      });
    }
  }, global.getInterval);
}

// Muting audio

// Removing audio & clear interval

// Animations

// Start application
cacheFilesURL(allAudioLinks, allVideoLinks).then(() => {
  if (global.isReady) {
    (
      document.getElementsByClassName("splashscreen")[0] as HTMLDivElement
    ).style.display = "none";
  }
});
