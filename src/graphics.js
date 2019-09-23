export default function Graphics(_canvas) {

  let { 
    canvas,
    pixelRatio,
    width,
    height,
    aspect } = _canvas;


  const ctx = canvas.getContext('2d');

  this.raw = f => f(ctx);


  ctx.scale(pixelRatio, pixelRatio);    
  _canvas.addResizeListener(() => {
    ctx.scale(pixelRatio, pixelRatio);    
  });
}
