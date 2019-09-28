import * as co from 'colourz';
import * as rP from '../renderplus';

import ipol from '../ipol';

export default function Dash(ctx, hexa) {
  
  let { renderer: r, assets: a, events: e } = ctx;

  let colEdge = new co.shifter(co.Palette.CrocTooth).lum(0.3).base();

  let pos;

  let iRadius;

  this.init = (opts) => {
    opts = {
      x: 0,
      y: 0,
      ...opts
    };

    pos = {
      x: opts.x,
      y: opts.y
    };
  };

  this.position = () => pos;

  this.shrink = () => {
    iRadius = new ipol(1.0, 0.0);
  };

  this.update = delta => {
    if (iRadius) {
      iRadius.update(delta * 0.0006);
    }
  };

  this.render = (bounds) => {

    let camera = hexa.camera;

    let sPos = camera.worldPos2ScreenPos([pos.x, pos.y], bounds);
 
    let screenRotate = camera
        .screenRotation();

    r.transform({
      rotate: screenRotate
    }, () => {
      r.transform({
        translate: sPos
      }, () => {


        if (iRadius) {
          r.drawCircle(0, 0, bounds.radius, colEdge
                       .reset()
                       .alp(0.2)
                       .css());

          r.drawCircle(0, 0, iRadius.value() * bounds.radius, 
                       colEdge.reset().css());
        }
      });
    });
  };

}
