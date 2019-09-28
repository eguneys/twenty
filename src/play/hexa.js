import Pool from 'poolf';
import * as co from 'colourz';

import Camera from './camera';
import Dash from './dash';
import DashGen from './dashgen';

import * as u from '../util';

export default function Hexa(ctx, play) {
  
  let { canvas: c, renderer: r, assets: a, events: e } = ctx;

  let boundsF = c.responsiveBounds(({ width, height }) => {
    return {
      width,
      height,
      radius: width * 0.22
    };
  });

  let color = new co.shifter(co.Palette.SwanWhite).lum(0.96).base();

  let dashes = new Pool(() => new Dash(ctx, this));
  let camera = this.camera = new Camera(ctx, this);
  let dashGen = new DashGen();

  this.init = () => {
    let bs = boundsF();

    camera.init();
    dashGen.init(bs);
  };

  const maybeAddDashes = () => {
    let bs = boundsF();
    let worldView = camera.worldView();
    let opts = dashGen.gen(worldView, bs);
    if (opts) {
      let dash = dashes.acquire(_ => _.init(opts));
      camera.addTarget(dash);
    }
  };

  const maybeDash = u.withDelay(() => {
    camera.dash();
  }, 2000);

  this.update = delta => {

    maybeAddDashes();
    maybeDash(delta);

    dashes.each(_ => _.update(delta));
    
    camera.update(delta);
  };

  this.render = () => {

    let bs = boundsF();

    r.drawRect(0, 0, bs.width, bs.height, color.css());

    dashes.each(_ => _.render(bs));

    camera.render(bs);
  };

}
