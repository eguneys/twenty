import Ground from './ground';
import * as u from '../util';

export default function Twenty(ctx, play) {

  let { canvas: c, renderer: r, assets: a, events: e } = ctx;

  let ground = new Ground(ctx, this);
  
  this.init = () => {
    ground.init();
  };

  this.update = delta => {
    ground.update(delta);
    maybeLiftTiles(delta);
  };

  const maybeLiftTiles = u.withDelay(delta => {
    ground.liftTiles();
  }, 5000);


  this.render = () => {

    ground.render();

  };

}
