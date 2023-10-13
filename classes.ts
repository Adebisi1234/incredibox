export interface prop {
  percentageMax: number;
  headHeight: number;
  totalFrame: string;
  arrayFrame: [x: number, y: number, translateX: number, translateY: number][];
}
export class GlobalState {
  public timeouts: {
    [key: string]: {
      paused: boolean;
      timeoutId: number;
      i: number;
      clear: boolean;
    };
  } = {};
  public randomMix: number[][] = [[], [], [], []]; // Maybe v1.1
  public mix: number[][] = [
    [1, 3, 5, 9],
    [1, 4, 6, 10],
    [2, 5, 7, 11],
  ]; // Maybe v1.1
  public userMix: number[][] = [[], [], []];
  public version: number = 0;
  public autoInterval: number = 0;
  public audiosInDom: { [key: string]: Audios } = {};
  public audioQueue: { audio: Audios; singerId: number }[] = [];
  public autoQueue: { audio: Audios; singerId: number }[] = [];
  public beat: number = 70;
  public transition: number = 0;
  public beatIntervalId: number = 0;
  public allAudios: { [key: number]: Audios } = {};
  public allVideo: { [key: number]: string } = {};
  public allSprites: { [key: number]: Blob } = {};
  public currentMovingSong: HTMLDivElement | undefined = undefined;
  public animeFrames: {
    [key: number]: prop;
  } = {};
  public allSongs: HTMLDivElement[] = [];
  public allLoaders: HTMLDivElement[] = [];
  public allSingers: HTMLDivElement[] = [];
  public allVideoPlayers: HTMLDivElement[] = [];
  public singersPost: {
    left: number;
    right: number;
    top: number;
    bottom: number;
    id: number;
  }[] = [];
  /**
   * getAudioLength
   * getSprite
   *
   */
  public getAudioLength(songId: number) {
    return (
      this.audiosInDom[songId].buffer.duration ||
      this.audioQueue[songId].audio.buffer.duration
    );
  }

  public getSprite(songId: number) {
    return this.allSprites[songId];
  }

  set setVersion(version: number) {
    this.version = version;
  }
}

export class Audios {
  audioCtx = new AudioContext();
  buffer: AudioBuffer;
  audioSource: AudioBufferSourceNode;
  gainNode: GainNode;
  id: string;
  constructor(buffer: AudioBuffer, id: string) {
    this.audioSource = this.audioCtx.createBufferSource();
    this.gainNode = this.audioCtx.createGain();
    this.buffer = buffer;
    this.audioSource.buffer = this.buffer;
    this.audioSource.loop = true;
    this.audioSource.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
    this.id = id;
  }

  protected playSound() {
    this.audioSource = this.audioCtx.createBufferSource();
    this.audioSource.buffer = this.buffer!;
    this.audioSource.loop = true;
    this.audioSource.connect(this.gainNode);
  }
  isMute() {
    return this.gainNode.gain.value;
  }
  muteSound() {
    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
  }
  unmuteSound() {
    this.gainNode.gain.setValueAtTime(1, this.audioCtx.currentTime);
  }
  play() {
    try {
      this.audioSource.start();
    } catch (error: unknown) {
      this.playSound();
      this.audioSource.start();
    }
  }
  stop() {
    try {
      this.audioSource.stop();
      this.playSound();
    } catch (error: unknown) {
      this.playSound();
      this.audioSource.start();
      this.audioSource.stop();
    }
  }
}
