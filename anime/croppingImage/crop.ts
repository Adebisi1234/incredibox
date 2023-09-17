export default function cropImage(
  canvas: HTMLCanvasElement,
  src: string,
  x: number,
  y: number,
  width: number,
  height: number,
  clear?: boolean
) {
  const context = canvas.getContext("2d");
  if(clear) {
    context?.clearRect(x,y,canvas.width, canvas.height)
  }
  const image = new Image();
  image.src = src;
  image.onload = () => {
    context?.drawImage(
      image,
      x,
      y,
      width,
      height,
      0,
      0,
      canvas.width,
      canvas.height
    );
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
