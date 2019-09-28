import Pool from 'poolf';
import * as co from 'colourz';

import Camera from './camera';
import Dash from './dash';
import DashGen from './dashgen';

import ipol from '../ipol';
import * as u from '../util';

export default function Hexa(ctx, play) {
  
  let { canvas: c, renderer: r, assets: a, events: e } = ctx;

  let boundsF = c.responsiveBounds(({ width, height }) => {
    return {
      width,
      height,
      hRadius: Math.min(width, height) * 0.04,
      radius: Math.min(width, height) * 0.22
    };
  });

  let color = new co.shifter(co.Palette.SwanWhite).lum(0.96).base();

  let iLum = ipol(0.8);
  let iFlash = ipol(0.0);

  let dashes = new Pool(() => new Dash(ctx, this));
  let camera = this.camera = new Camera(ctx, this);
  let dashGen = new DashGen();

  let gameover;

  this.init = () => {
    let bs = boundsF();

    gameover = 0;

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
  }, 500);

  const updateBackground = (delta) => {
    iLum.update(delta * 0.02);
    iFlash.update(delta * 0.01);

    color
      .lum(iLum.value() + iFlash.value()).base();
  };

  this.hit = (die) => {
    iFlash.value(0.1);

    if (die) {
      iLum.target(0.2);
      color.sat(0.1).base();
      dashes.each(_ => _.die());

      gameover = u.now();
    }
  };

  this.update = delta => {

    maybeAddDashes();
    maybeDash(delta);

    updateBackground(delta);

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
