// Implementing a workaround playing diff. versions of one song
const exec = require("child_process").exec;

function concatAudio(command, callback) {
  exec(command, function (error, stdout, stderr) {
    callback(stdout);
  });
}
const audios = [
  "melo4_hu",
  "melo3_neou",
  "melo2_flute",
  "melo1_toun",
  "effect1_bass",
  "drum5_chatom",
  "drum2_snare",
  "drum1_kick",
  "chips4_filback",
  "chips1_feel",
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
