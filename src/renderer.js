import * as mu from 'mutilz';
import Graphics from './graphics';

export default function Renderer(canvas) {

  const { width, height, aspect } = canvas;

  this.data = {
    width,
    height,
    aspect
  };
  
  const g = new Graphics(canvas);

  this.transform = ({ translate = [0, 0], 
                      rotate = 0,
                      w,
                      h = w }, f) =>
  g.raw(ctx => {
    ctx.save();
    ctx.translate(translate[0], translate[1]);

    let halfW = w * 0.5,
        halfH = h * 0.5;

    ctx.translate(halfW, halfH);    
    ctx.rotate(rotate);
    ctx.translate(-halfW, -halfH);

    f(ctx);
    ctx.restore();
  });

  this.fill = (path, color = 'black') =>
  g.raw(ctx => {
    ctx.fillStyle = color;
    ctx.fill(path);
  });

  this.drawRect = (x, y, w, h, color = 'black') =>
  g.raw(ctx => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  });

  this.drawCircle = (x, y, radius, color = 'black') =>
  g.raw(ctx => {
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, mu.TAU);
  });


  this.clear = (color = '#ccc') => 
  g.raw(ctx => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);    
  });


}
