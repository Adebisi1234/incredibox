// Implementing a workaround playing diff. versions of one song
const exec = require("child_process").exec;

function concatAudio(command, callback) {
  exec(command, function (error, stdout, stderr) {
    callback(stdout);
  });
}
const audios = [
  "effet1_long",
  "effet5_rythme",
  "melo4_clav",
  "voix2_ride",
  "voix3_over",
  "voix5_sunrise",
];
const log = (data) => {
  console.log(data);
};
audios.forEach((audio) => {
  concatAudio(
    `ffmpeg -i "concat:${audio}_a.ogg|${audio}_b.ogg" -c copy ${audio}.ogg`,
    log
  );
});
