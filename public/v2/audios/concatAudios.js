// Implementing a workaround playing diff. versions of one song
const exec = require("child_process").exec;

function concatAudio(command, callback) {
  exec(command, function (error, stdout, stderr) {
    callback(stdout);
    callback(error, stderr);
  });
}
const audios = [
  "beat1",
  "beat2",
  "beat4",
  "beat5",
  "coeur1",
  "coeur2",
  "coeur3",
  "effet1",
  "effet3",
  "effet5",
  "melo1",
  "melo2",
  "melo3",
  "melo4",
  "melo5",
  "voix1",
  "voix2",
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
