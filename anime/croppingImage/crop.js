export default function cropImage(canvas, src, x, y, width, height, clear) {
    const context = canvas.getContext("2d");
    if (clear) {
        context === null || context === void 0 ? void 0 : context.clearRect(x, y, canvas.width, canvas.height);
    }
    const image = new Image();
    image.src = src;
    image.onload = () => {
        context === null || context === void 0 ? void 0 : context.drawImage(image, x, y, width, height, 0, 0, canvas.width, canvas.height);
    };
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
