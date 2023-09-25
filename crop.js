export default function cropImage(canvas, image, x, y, width, height) {
    canvas.style.opacity = "1";
    const context = canvas.getContext("2d");
    context === null || context === void 0 ? void 0 : context.clearRect(0, 0, canvas.width, canvas.height);
    context === null || context === void 0 ? void 0 : context.drawImage(image, x, y, width, height, 0, 0, canvas.width, canvas.height);
}
export function clearRect(canvas) {
    console.log("wtf");
    const context = canvas.getContext("2d");
    context.fillStyle = "rgba(0,0,0,0)";
    context === null || context === void 0 ? void 0 : context.fillRect(0, 0, canvas.width, canvas.height);
    context === null || context === void 0 ? void 0 : context.clearRect(0, 0, canvas.width, canvas.height);
}
// context?.drawImage(image, sx: Number, sy: Number, sw: Number, sh: Number, dx: Number, dy: Number, dw: Number, dh: Number)
// image.onload = ()=> {
//     context?.drawImage(image, sx: Number, sy: Number, sw: Number, sh: Number, dx: Number, dy: Number, dw: Number, dh: Number)
// }
/*
sx: OG x-co-ordinate
sy: OG y-co-ordinate
sWidth: croppedWidth,
sHeight: croppedHeight
dx: draw x-coordinate
dy: draw y-coordinate
dWidth: draw width i.e canvas :) width
dheight: draw height i.e canvas :) height
*/
// if (typeof window.createImageBitmap !== "function") {
//   window.createImageBitmap = monkeyPatch;
// }
// var img = new Image();
// img.crossOrigin = "anonymous";
// img.src = "https://upload.wikimedia.org/wikipedia/commons/b/be/SpriteSheet.png";
// img.onload = function () {
//   makeSprites().then(draw);
// };
// function makeSprites() {
//   var coords = [],
//     x,
//     y;
//   for (y = 0; y < 3; y++) {
//     for (x = 0; x < 4; x++) {
//       coords.push([x * 132, y * 97, 132, 97]);
//     }
//   }
//   return Promise.all(
//     coords.map(function (opts) {
//       return createImageBitmap.apply(window, [img].concat(opts));
//     })
//   );
// }
// function draw(sprites) {
//   var delay = 96;
//   var current = 0,
//     lastTime = performance.now(),
//     ctx = document.getElementById("canvas").getContext("2d");
//   anim();
//   function anim(t) {
//     requestAnimationFrame(anim);
//     if (t - lastTime < delay) return;
//     lastTime = t;
//     current = (current + 1) % sprites.length;
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     ctx.drawImage(sprites[current], 0, 0);
//   }
// }
// function monkeyPatch(source, sx, sy, sw, sh) {
//   return Promise.resolve().then(drawImage);
//   function drawImage() {
//     var canvas = document.createElement("canvas");
//     canvas.width =
//       sw || source.naturalWidth || source.videoWidth || source.width;
//     canvas.height =
//       sh || source.naturalHeight || source.videoHeight || source.height;
//     canvas
//       .getContext("2d")
//       .drawImage(
//         source,
//         sx || 0,
//         sy || 0,
//         canvas.width,
//         canvas.height,
//         0,
//         0,
//         canvas.width,
//         canvas.height
//       );
//     return canvas;
//   }
// }
