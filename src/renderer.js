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

  this.raw = g.raw;

  const boundsToPath = (bounds) => {
    let path = new Path2D();
    path.rect(bounds.x, bounds.y, bounds.width, bounds.height);
    return path;
  };

  this.checkTapHandler = (bounds, handler, e) =>
  g.raw(ctx => {
    let current = e.data.current;
    if (current && !current.onetap.handled) {
      let path = boundsToPath(bounds);
      if (ctx.isPointInPath(path, current.start.x, current.start.y)) {
        handler();
      }
    }
  });

  this.checkBounds = (bounds, x, y) =>
  g.raw(ctx => {
    let path = boundsToPath(bounds);
    return ctx.isPointInPath(path, x, y);
  });

  this.transform = ({ translate = [0, 0], 
                      rotate = 0,
                      w,
                      h = w }, f) =>
  g.raw(ctx => {
    ctx.save();

    let halfW = w * 0.5,
        halfH = h * 0.5;

    ctx.translate(translate[0], translate[1]);

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
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, mu.TAU);
    ctx.fill();
  });

  this.drawPoints = (points, color = 'black') =>
  g.raw(ctx => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.fill();
  });

  this.drawText = (x, y, opts, color = 'black') => {
    opts = {
      size: 30,
      weight: 'normal',
      align: 'center',
      baseline: 'middle',
      ...opts
    };
    g.raw(ctx => {
      ctx.fillStyle = color;
      ctx.font = `${opts.weight} ${opts.size}px Rubik`;
      ctx.textAlign = opts.align;
      ctx.textBaseline = opts.baseline;
      ctx.fillText(opts.text, x, y);
    });
  };

  this.roundedRect = (x, y, width, height, radius, color) =>
  g.raw(ctx => {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    ctx.fill();
  });

  this.drawImage = (x, y, width, height, image) =>
  g.raw(ctx => {
    ctx.drawImage(image, x, y, width, height);
  });


  this.drawLogo = ({ x, y, width, height }, image, color = '#ccc') => {
    this.drawCircle(x + width * 0.4,
                    y + height * 0.5,
                    width, color);
    this.drawImage(x, y, width, height, image);
  };

  this.clear = (color = '#ccc') => 
  g.raw(ctx => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);    
  });


}
