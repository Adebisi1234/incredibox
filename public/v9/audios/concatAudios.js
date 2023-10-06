// Implementing a workaround playing diff. versions of one song
const exec = require("child_process").exec;

function concatAudio(command, callback) {
  exec(command, function (error, stdout, stderr) {
    callback(stdout);
  });
}
const audios = ["17_memphis"];
const log = (data) => {
  console.log(data);
};
audios.forEach((audio) => {
  concatAudio(
    `ffmpeg -i "concat:${audio}_a.ogg|${audio}_b.ogg" -c copy ${audio}.ogg`,
    log
  );
});
