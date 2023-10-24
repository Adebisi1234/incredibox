import { global, mixtape } from "./main.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let imgWidth = hd(164);
let imgHeight = hd(318);
let canvasToIntrinsicRatio = canvas.clientHeight / imgHeight;
ctx.imageSmoothingEnabled = false;
window.addEventListener("load", () => {
    // Draw all the singers
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    drawAllSingers();
    global.singersPost = global.allSingers.map((singer) => {
        const { left, right, top, bottom } = singer.getBoundingClientRect();
        return {
            left,
            right,
            top,
            bottom,
            id: +singer.id,
        };
    });
});
window.addEventListener("resize", () => {
    // RE-draw all the singers
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    drawAllSingers();
    global.singersPost = global.allSingers.map((singer) => {
        const { left, right, top, bottom } = singer.getBoundingClientRect();
        return {
            left,
            right,
            top,
            bottom,
            id: +singer.id,
        };
    });
});
let imgSource;
export const isSongInPosition = (left, right, top, bottom) => {
    let id = 0;
    global.singersPost.forEach((singer, i) => {
        if (singer.left < left &&
            singer.right > right &&
            singer.top < top &&
            singer.bottom > bottom) {
            id = singer.id;
            global.allSingers[i].classList.add("over");
        }
        else {
            global.allSingers[i].classList.remove("over");
        }
    });
    return id;
};
// const eyesWidth = 80 * 2; //hd?
// const eyesHeight = 40 * 2; //480; //hd?
// const eyesX = 574 * 2; //hd?
// const eyesY = 0 * 2; //hd?
function hd(num) {
    return canvas.width < 1000 ? num : num * 2;
}
async function drawAllSingers() {
    imgWidth = hd(164);
    imgHeight = hd(320);
    imgSource =
        canvas.clientWidth < 1000
            ? await (await fetch("/public/polo-sprite.png")).blob()
            : await (await fetch("/public/polo-sprite-hd.png")).blob();
    const img = await createImageBitmap(imgSource);
    for (let i = 0; i <= 8; i++) {
        ctx?.drawImage(img, 0, 0, imgWidth, imgHeight, (canvas.width / 8) * i, 0, canvas.width / 8, canvas.height);
    }
}
export async function startAnim(singerId, songId) {
    const pausedImage = global.getSprite(songId);
    const img = await createImageBitmap(pausedImage, 0, 0, imgWidth, imgHeight);
    // Remove overlay
    if (global.allSingers[singerId - 1].getAttribute("data-song-id")) {
        global.allSingers[singerId - 1].classList.add("active");
        ctx?.clearRect((canvas.width / 8) * (singerId - 1), 0, canvas.width / 8, canvas.height);
        ctx?.drawImage(img, (canvas.width / 8) * (singerId - 1), 50, canvas.width / 8, canvas.height);
        setTimeout(() => {
            ctx?.clearRect((canvas.width / 8) * (singerId - 1), 0, canvas.width / 8, canvas.height);
            ctx?.drawImage(img, (canvas.width / 8) * (singerId - 1), 0, canvas.width / 8, canvas.height);
        }, 200);
    }
}
export function resetSongs() {
    global.allSingers.forEach((singer) => {
        const songId = singer.getAttribute("data-song-id");
        singer.removeAttribute("data-song-id");
        if (songId) {
            clearAnim(+singer.id, +songId);
            mixtape(+songId, "drop");
        }
    });
    // Catching escapees
    for (const audio in global.audiosInDom) {
        global.audiosInDom[audio].stop();
    }
    for (const audio in global.audioQueue) {
        global.audioQueue[audio].audio.stop();
    }
}
export function pauseSongs() {
    global.allSingers.forEach((singer, singerId) => {
        const songId = singer.getAttribute("data-song-id");
        if (songId) {
            global.timeouts[singerId + 1].paused = true;
            global.audiosInDom[songId]
                ? global.audiosInDom[songId].muteSound()
                : global.audioQueue
                    .find((audio) => audio.audio.id === songId)
                    ?.audio.muteSound();
            singer.classList.remove("active");
        }
    });
}
export function resumeSongs() {
    global.allSingers.forEach((singer, singerId) => {
        const songId = singer.getAttribute("data-song-id");
        if (songId) {
            global.timeouts[singerId + 1].paused = false;
            global.audiosInDom[songId].unmuteSound();
            singer.classList.add("active");
        }
    });
}
export async function clearAnim(singerId, songId) {
    global.timeouts[singerId].clear = true;
    clearTimeout(global.timeouts[singerId].timeoutId);
    global.allAudios[songId]?.stop();
    const img = await createImageBitmap(imgSource);
    ctx?.clearRect((canvas.width / 8) * (singerId - 1), 0, canvas.width / 8, canvas.height);
    ctx?.drawImage(img, 0, 0, imgWidth, imgHeight, (canvas.width / 8) * (singerId - 1), 0, canvas.width / 8, canvas.height);
    setTimeout(() => {
        global.timeouts[singerId] = {
            i: 0,
            timeoutId: 0,
            paused: false,
            clear: false,
        };
    }, 200);
    global.allSingers[singerId - 1].classList.remove("active");
    global.allSingers[singerId - 1].removeAttribute("data-song-id");
    global.allSongs[songId - 1].classList.remove("moved");
    global.audiosInDom[songId]?.unmuteSound();
    delete global.audiosInDom[songId];
}
export async function animate(singerId, songId) {
    clearTimeout(global.timeouts[singerId].timeoutId);
    const animeImg = global.getSprite(songId);
    const img = await createImageBitmap(animeImg);
    const animeFrame = global.animeFrames[songId];
    // get frame per seconds
    let fps = animeFrame.arrayFrame.length / global.getAudioLength(songId);
    const interval = Math.round(1000 / fps);
    // Draw the body
    if (!global.timeouts[singerId].clear &&
        global.allSingers[singerId - 1].getAttribute("data-song-id")) {
        ctx?.clearRect((canvas.width / 8) * (singerId - 1), 0, canvas.width / 8, canvas.height);
        ctx?.drawImage(img, imgWidth, 0, imgWidth, imgHeight, (canvas.width / 8) * (singerId - 1), 0, canvas.width / 8, canvas.height);
    }
    const animation = () => {
        if (global.timeouts[singerId].clear) {
            clearTimeout(global.timeouts[singerId].timeoutId);
            return;
        }
        let i = global.timeouts[singerId].i % animeFrame.arrayFrame.length;
        requestAnimationFrame(() => {
            if (global.allSingers[singerId - 1].getAttribute("data-song-id")) {
                if (global.timeouts[singerId].paused) {
                    // Draw first frame
                    ctx?.clearRect((canvas.width / 8) * (singerId - 1), 0, canvas.width / 8, canvas.height);
                    ctx?.drawImage(img, 0, 0, imgWidth, imgHeight, (canvas.width / 8) * (singerId - 1), 0, canvas.width / 8, canvas.height);
                }
                else {
                    // Remove previous frame
                    ctx?.clearRect((canvas.width / 8) * (singerId - 1), 0, canvas.width / 8, canvas.height);
                    // Redraw body
                    ctx?.drawImage(img, imgWidth, 0, imgWidth, imgHeight, (canvas.width / 8) * (singerId - 1), 0, canvas.width / 8, canvas.height);
                    // Draw new head
                    ctx?.drawImage(img, hd(animeFrame.arrayFrame[i][0]), hd(animeFrame.arrayFrame[i][1]), imgWidth, hd(animeFrame.headHeight), (canvas.width / 8) * (singerId - 1) +
                        hd(animeFrame.arrayFrame[i][2] * canvasToIntrinsicRatio), hd(animeFrame.arrayFrame[i][3] * canvasToIntrinsicRatio), canvas.width / 8, animeFrame.headHeight * canvasToIntrinsicRatio);
                    // play song
                    if (global.timeouts[singerId].i === 0 &&
                        (!global.timeouts[singerId].clear ||
                            !global.timeouts[singerId].paused)) {
                        global.audiosInDom[songId]?.play();
                    }
                }
                global.timeouts[singerId].i++;
            }
        });
        global.timeouts[singerId].timeoutId = setTimeout(animation, interval);
    };
    animation();
}
