// Implementing a workaround playing diff. versions of one song
const exec = require("child_process").exec;

function concatAudio(command, callback) {
  exec(command, function (error, stdout, stderr) {
    callback(stdout);
  });
}
const audios = [
  "1_atlanta",
  "2_tuctom",
  "3_foubreak",
  "4_koukaki",
  "5_koungou",
  "6_bass",
  "7_monk",
  "8_sonar",
  "9_souffle",
  "10_epifle",
  "11_arpeg",
  "12_tromp",
  "13_pizzi",
  "14_organ",
  "15_synth",
  "16_follow",
  "17_choir",
  "18_houhou",
  "19_reach",
  "20_believe",
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
