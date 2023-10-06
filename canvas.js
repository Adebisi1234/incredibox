import { global } from "./main.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let imgWidth = canvas.offsetWidth < 1000 ? 164 : 328;
let imgHeight = canvas.offsetHeight < 1000 ? 380 : 760;
let canvasToIntrinsicRatio = canvas.offsetHeight / imgHeight;
ctx.imageSmoothingEnabled = false;
window.addEventListener("load", () => {
    // Draw all the singers
    canvas.width = +canvas.offsetWidth;
    canvas.height = +canvas.offsetHeight;
    drawAllSingers();
});
window.addEventListener("resize", () => {
    // RE-draw all the singers
    canvas.width = +canvas.offsetWidth;
    canvas.height = +canvas.offsetHeight;
    drawAllSingers();
});
// const eyesWidth = 80 * 2; //hd?
// const eyesHeight = 40 * 2; //480; //hd?
// const eyesX = 574 * 2; //hd?
// const eyesY = 0 * 2; //hd?
async function drawAllSingers() {
    imgWidth = canvas.width < 1000 ? 164 : 328;
    imgHeight = canvas.width < 1000 ? 380 : 760;
    const imgSource = canvas.width < 1000
        ? await (await fetch("/public/polo-sprite.png")).blob()
        : await (await fetch("/public/polo-sprite-hd.png")).blob();
    const img = await createImageBitmap(imgSource);
    for (let i = 0; i <= 8; i++) {
        ctx?.drawImage(img, 0, 0, imgWidth, canvas.width < 1000 ? 320 : 640, (canvas.width / 8) * i, 0, canvas.width / 8, canvas.height);
    }
}
export async function pauseAnim(singerId, songId) {
    const pausedImage = global.getSprite(+songId);
    const img = await createImageBitmap(pausedImage, 0, 0, imgWidth, imgHeight);
    global.timeouts[songId].paused = true;
    ctx?.clearRect((canvas.width / 8) * (+singerId - 1), 0, canvas.width / 8, canvas.height);
    ctx?.drawImage(img, (canvas.width / 8) * (+singerId - 1), 0, canvas.width / 8, canvas.height);
}
export async function clearAnim(singerId, songId) {
    const defaultSinger = canvas.width < 1000
        ? await (await fetch("/public/polo-sprite.png")).blob()
        : await (await fetch("/public/polo-sprite-hd.png")).blob();
    const img = await createImageBitmap(defaultSinger);
    clearTimeout(global.timeouts[songId].timeoutId);
    global.timeouts[songId].i = 0;
    ctx?.clearRect((canvas.width / 8) * (+singerId - 1), 0, canvas.width / 8, canvas.height);
    ctx?.drawImage(img, (canvas.width / 8) * (+singerId - 1), 0, canvas.width / 8, canvas.height);
}
export async function animate(singerId, songId) {
    const animeImg = global.getSprite(songId);
    const img = await createImageBitmap(animeImg);
    const animeFrame = global.animeFrames[songId];
    // Try to get frame per seconds or something
    let fps = animeFrame.arrayFrame.length / global.getAudioLength(songId);
    const interval = Math.round(1000 / fps);
    // Draw the body
    ctx?.drawImage(img, imgWidth, 0, imgWidth, imgHeight, (canvas.width / 8) * (+singerId - 1), 0, canvas.width / 8, canvas.height);
    const animation = () => {
        let i = global.timeouts[songId].i;
        requestAnimationFrame(() => {
            if (!global.timeouts[songId].paused) {
                ctx?.clearRect((canvas.width / 8) * (+singerId - 1), 0, canvas.width / 8, animeFrame.headHeight * canvasToIntrinsicRatio);
                ctx?.drawImage(img, animeFrame.arrayFrame[i][0], animeFrame.arrayFrame[i][1], imgWidth, animeFrame.headHeight, (canvas.width / 8) * (+singerId - 1) + animeFrame.arrayFrame[i][2], (canvas.width / 8) * (+singerId - 1) + animeFrame.arrayFrame[i][3], canvas.width / 8, animeFrame.headHeight * canvasToIntrinsicRatio);
            }
            global.timeouts[songId].i++;
            if (global.timeouts[songId].i === animeFrame.arrayFrame.length) {
                global.timeouts[songId].i = 0;
            }
        });
        global.timeouts[songId].timeoutId = setTimeout(animation, interval);
    };
    animation();
}
// export default function cropImage(
//   canvas: HTMLCanvasElement,
//   image: ImageBitmap,
//   x: number,
//   y: number,
//   width: number,
//   height: number
// ) {
//   canvas.style.opacity = "1";
//   const context = canvas.getContext("2d");
//   context?.clearRect(0, 0, canvas.width, canvas.height);
//   context?.drawImage(
//     image,
//     x,
//     y,
//     width,
//     height,
//     0,
//     0,
//     canvas.width,
//     canvas.height
//   );
// }
// export function clearRect(canvas: HTMLCanvasElement) {
//   console.log("wtf");
//   const context = canvas.getContext("2d");
//   context!.fillStyle = "rgba(0,0,0,0)";
//   context?.fillRect(0, 0, canvas.width, canvas.height);
//   context?.clearRect(0, 0, canvas.width, canvas.height);
// }
// // context?.drawImage(image, sx: Number, sy: Number, sw: Number, sh: Number, dx: Number, dy: Number, dw: Number, dh: Number)
// // image.onload = ()=> {
// //     context?.drawImage(image, sx: Number, sy: Number, sw: Number, sh: Number, dx: Number, dy: Number, dw: Number, dh: Number)
// // }
// /*
// sx: OG x-co-ordinate
// sy: OG y-co-ordinate
// sWidth: croppedWidth,
// sHeight: croppedHeight
// dx: draw x-coordinate
// dy: draw y-coordinate
// dWidth: draw width i.e canvas :) width
// dheight: draw height i.e canvas :) height
// */
// // if (typeof window.createImageBitmap !== "function") {
// //   window.createImageBitmap = monkeyPatch;
// // }
// // var img = new Image();
// // img.crossOrigin = "anonymous";
// // img.src = "https://upload.wikimedia.org/wikipedia/commons/b/be/SpriteSheet.png";
// // img.onload = function () {
// //   makeSprites().then(draw);
// // };
// // function makeSprites() {
// //   var coords = [],
// //     x,
// //     y;
// //   for (y = 0; y < 3; y++) {
// //     for (x = 0; x < 4; x++) {
// //       coords.push([x * 132, y * 97, 132, 97]);
// //     }
// //   }
// //   return Promise.all(
// //     coords.map(function (opts) {
// //       return createImageBitmap.apply(window, [img].concat(opts));
// //     })
// //   );
// // }
// // function draw(sprites) {
// //   var delay = 96;
// //   var current = 0,
// //     lastTime = performance.now(),
// //     ctx = document.getElementById("canvas").getContext("2d");
// //   anim();
// //   function anim(t) {
// //     requestAnimationFrame(anim);
// //     if (t - lastTime < delay) return;
// //     lastTime = t;
// //     current = (current + 1) % sprites.length;
// //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
// //     ctx.drawImage(sprites[current], 0, 0);
// //   }
// // }
// // function monkeyPatch(source, sx, sy, sw, sh) {
// //   return Promise.resolve().then(drawImage);
// //   function drawImage() {
// //     var canvas = document.createElement("canvas");
// //     canvas.width =
// //       sw || source.naturalWidth || source.videoWidth || source.width;
// //     canvas.height =
// //       sh || source.naturalHeight || source.videoHeight || source.height;
// //     canvas
// //       .getContext("2d")
// //       .drawImage(
// //         source,
// //         sx || 0,
// //         sy || 0,
// //         canvas.width,
// //         canvas.height,
// //         0,
// //         0,
// //         canvas.width,
// //         canvas.height
// //       );
// //     return canvas;
// //   }
// // }
// // const eyes = await createImageBitmap(
// //   imgSource,
// // );
// // console.log(eyes);
// const ratioH = canvas.height / img.height;
// const ratioX = imgWidth / img.height;
// const eyesPositionWidth = 80 * ratioX;
// const eyesPositionHeight = 40 * ratioH;
// const eyesPositionX = 40 * ratioX;
// Eyes
// console.log(
//   img,
//   eyesX,
//   eyesY,
//   eyesWidth,
//   eyesHeight,
//   eyesPositionX * i,
//   eyesPositionY * i,
//   eyesPositionWidth,
//   eyesPositionHeight
// );
// ctx?.drawImage(
//   img,
//   eyesX,
//   eyesY,
//   eyesWidth,
//   eyesHeight,
//   eyesPositionX,
//   eyesPositionY,
//   eyesPositionWidth,
//   eyesPositionHeight
// );
