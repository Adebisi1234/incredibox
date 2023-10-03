var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { global } from "main.js";
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
function drawAllSingers() {
    return __awaiter(this, void 0, void 0, function* () {
        imgWidth = canvas.offsetWidth < 1000 ? 164 : 328;
        imgHeight = canvas.offsetHeight < 1000 ? 380 : 760;
        const imgSource = canvas.width < 1000
            ? yield (yield fetch("/public/polo-sprite.png")).blob()
            : yield (yield fetch("/public/polo-sprite-hd.png")).blob();
        const img = yield createImageBitmap(imgSource);
        for (let i = 0; i <= 8; i++) {
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, 0, 0, imgWidth, imgHeight, (canvas.width / 8) * i, 0, canvas.width / 8, canvas.height);
        }
    });
}
export function pauseAnim(singerId, songId) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const pausedImage = global.getSprites(songId);
        const img = yield createImageBitmap(pausedImage, 0, 0, imgWidth, imgHeight);
        global.timeouts[songId].paused = true;
        ctx === null || ctx === void 0 ? void 0 : ctx.clearRect((canvas.width / 8) * (+singerId - 1), 0, canvas.width / 8, canvas.height);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, (canvas.width / 8) * (+singerId - 1), 0, canvas.width / 8, canvas.height);
    });
}
export function clearAnim(singerId, songId) {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultSinger = canvas.width < 1000
            ? yield (yield fetch("/public/polo-sprite.png")).blob()
            : yield (yield fetch("/public/polo-sprite-hd.png")).blob();
        const img = yield createImageBitmap(defaultSinger);
        clearTimeout(global.timeouts[songId].timeoutId);
        global.timeouts[songId].i = 0;
        ctx === null || ctx === void 0 ? void 0 : ctx.clearRect((canvas.width / 8) * (+singerId - 1), 0, canvas.width / 8, canvas.height);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, (canvas.width / 8) * (+singerId - 1), 0, canvas.width / 8, canvas.height);
    });
}
export function animate(singerId, songId) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const animeImg = global.getSprite(songId);
        const img = yield createImageBitmap(animeImg);
        const animeFrame = global.getAnimeFrames(songId);
        // Try to get frame per seconds or something
        let interval = global.getAudioLength(songId) / animeFrame.prop.length;
        interval = interval * animeFrame.percentageMax;
        // Draw the body
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, imgWidth, 0, imgWidth, imgHeight, (canvas.width / 8) * (+singerId - 1), 0, canvas.width / 8, canvas.height);
        const animation = () => {
            let i = global.timeouts[songId].i;
            requestAnimationFrame(() => {
                if (!global.timeouts[songId].paused) {
                    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect((canvas.width / 8) * (+singerId - 1), 0, canvas.width / 8, canvas.height);
                    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, animeFrame.prop[i].x, animeFrame.prop[i].y, canvas.width / 8, animeFrame.headHeight, (canvas.width / 8) * (+singerId - 1) + animeFrame.prop[i].translateX, (canvas.width / 8) * (+singerId - 1) + animeFrame.prop[i].translateY, canvas.width / 8, animeFrame.headHeight * canvasToIntrinsicRatio);
                }
                global.timeouts[songId].i++;
                if (global.timeouts[songId].i === animeFrame.prop.length) {
                    global.timeouts[songId].i = 0;
                }
            });
            global.timeouts[songId].timeoutId = setTimeout(animation, interval);
        };
        animation();
    });
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
