const audioCt = new AudioContext();
let buffer;

fetchAudio("1_atlanta").then((buf) => {
  // executes when buffer has been decoded
  buffer = buf;
  console.log(buffer);
  const source = audioCt.createBufferSource();
  // On drop audio
  source.buffer = buffer;
  console.log(source);
  source.connect(audioCt.destination);
  source.loop = true;
  console.log(source.start());
});

// fetchAudio() returns a Promise
// it uses fetch() to load an audio file
// it uses decodeAudioData to decode it into an AudioBuffer
// decoded AudioBuffer is buf argument for Promise.then((buf) => {})
// play.onclick() creates a single-use AudioBufferSourceNode
async function fetchAudio(name) {
  try {
    let rsvp = await fetch(`${name}.ogg`);
    return audioCt.decodeAudioData(await rsvp.arrayBuffer()); // returns a Promise, buffer is arg for .then((arg) => {})
  } catch (err) {
    console.log(
      `Unable to fetch the audio file: ${name} Error: ${err.message}`
    );
  }
}

// Bigger testing
