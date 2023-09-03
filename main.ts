class GlobalState {
  private ready = false;
  get isReady() {
    return this.ready;
  }
  set isLoading(loading: boolean) {
    this.ready = !loading;
  }
}

const GLOBAL = new GlobalState();

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
try {
  (async function cacheAudioURL() {
    for (const audioLink in allAudioLinks) {
      const audioBlob = await fetchBlob(audioLink);
      allCachedAudioURL[audioLink] = URL.createObjectURL(audioBlob);
    }
    console.log(allCachedAudioURL);
  })();

  (async function cacheVideoURL() {
    for (const VideoLink in allVideoLinks) {
      const VideoBlob = await fetchBlob(VideoLink);
      allCachedVideoURL[VideoLink] = URL.createObjectURL(VideoBlob);
    }
    console.log(allCachedVideoURL);
  })();
} catch (err) {
  throw new Error();
}
GLOBAL.isLoading = false;

if (GLOBAL.isReady) {
  (
    document.getElementsByClassName("splashscreen")[0] as HTMLDivElement
  ).style.display = "none";
}

// dragging songs

// customizing the singers

// Playing video

// Playing audio

// Muting audio

// Removing audio

// Animations
