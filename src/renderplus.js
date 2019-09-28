import * as mu from 'mutilz';

export function halfCircle(x, y, radius, angle, width, color) {
  return ctx => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, angle);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
  };  
}

export function line(x, y, x2, y2, color, lineWidth = 4) {
  return ctx => {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.arc(x2, y2, 2, 0, mu.TAU);
    ctx.fill();
  };
}

export function roundedRect(x, y, width, height, color, radius) {
  return ctx => {
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
  };
}

export function hexa(x, y, width, color, color2, color3) {
  let height = width;
  let radius = 10;

  return ctx => {

    roundedRect(x, y, width, height, color3, radius)(ctx);

    roundedRect(x, y, width, height * 0.95, color, radius)(ctx);

    ctx.fillStyle = color2;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height * 0.5);
    ctx.quadraticCurveTo(x, y + height * 0.1, x, y + height * 0.5);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    // ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    // ctx.lineTo(x, y + radius);

    ctx.closePath();

    ctx.fill();
    
    
  };
}
