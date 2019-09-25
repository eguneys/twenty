import Ground from './ground';
import { rows, cols } from './ground';

export default function Twenty(ctx, play) {

  let { canvas: c, renderer: r, assets: a, events: e } = ctx;

  const bGroundF = c.responsiveBounds(({ width, height, pixelRatio }) => {

    let gWidth = width * 0.95,
        tileSize = gWidth / cols,
        gHeight = tileSize * rows,
        gMargin = (width - gWidth) * 0.5,
        gTopOffset = gHeight * 0.1,
        gBottomOffset = gWidth * 0.25 + gMargin;

    return {
      x: gMargin,
      y: gMargin + gTopOffset,
      width: gWidth,
      height: gHeight,
      tileSize,
      pixelRatio
    };
  });

  let ground = new Ground(ctx, this);
  
  this.init = () => {
    ground.init();
  };

  this.update = delta => {
    ground.update(delta);
  };

  this.render = () => {

    let bGround = bGroundF();

    r.transform({
      translate: [bGround.x, bGround.y]
    }, () => {
      ground.render(bGround);
    });

    ground.renderDragLayer(bGround);
  };

}
