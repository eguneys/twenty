export default function Graphics({ 
  canvas,
  width,
  height,
  aspect }) {

  const ctx = canvas.getContext('2d');

  this.raw = f => f(ctx);

}
