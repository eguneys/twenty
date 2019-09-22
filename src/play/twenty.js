import Ground from './ground';
import { rows, cols } from './ground';

export default function Twenty(ctx, play) {

  let { renderer: r, assets: a, events: e } = ctx;

  const { width, height } = r.data;

  let gWidth = width * 0.95,
      tileSize = gWidth / cols,
      gHeight = tileSize * rows,
      gMargin = (width - gWidth) * 0.5,
      gBottomOffset = gWidth * 0.25 + gMargin;

  const bGround = {
    x: gMargin,
    y: height - gHeight - gBottomOffset,
    width: gWidth,
    height: gHeight,
    tileSize
  };

  let ground = new Ground(ctx, this);
  
  this.init = () => {
    ground.init();
  };

  this.update = delta => {
    ground.update(delta);
  };

  this.render = () => {
    
    r.transform({
      translate: [bGround.x, bGround.y]
    }, () => {
      ground.render(bGround);
    });

    ground.renderDragLayer(bGround);
  };

}
