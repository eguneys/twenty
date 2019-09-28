import * as mu from 'mutilz';
import ipol from '../ipol';
import { interpolator2 as ipol2 } from '../ipol';
import * as v2 from '../vector2';

export default function Camera(ctx, play) {

  let { canvas: c, renderer: r, assets: a, events: e } = ctx;

  let boundsF = c.responsiveBounds(({ width, height }) => {
    return {
      width,
      height,
      radius: width * 0.22
    };
  });

  let iPos;
  let targets = [];
  let fPos;
  let iRot;

  let landDash;

  this.init = () => {
    iRot = new ipol(0);
  };
 
  this.worldView = () => {
    if (!iPos) {
      return [0, 0];
    } else {
      return fPos.value();
    }
  };


  this.worldPos2ScreenPos = (worldPos, bs) => {
    let wView = this.worldView();

    let sPos = v2.sub(worldPos, wView);

    return [sPos[0] + bs.width * 0.5, bs.height * 0.7 - sPos[1]];
  };

  this.screenRotation = () => {
    return iRot.value();
  };



  this.addTarget = (dash) => {
    let target = dash.position();
    if (!iPos) {
      iPos = new ipol2([target.x, target.y]);
      fPos = new ipol2([target.x, target.y]);
    } else {
      targets.push(dash);
    }
  };

  this.dash = () => {
    landDash = targets.shift();

    let t = landDash.position();
    
    iPos.target([t.x, t.y]);

    iRot.target(mu.rand(-mu.TAU * 0.06, mu.TAU * 0.06));
  };

  const maybeFollow = () => {
    let bs = boundsF();
    if (iPos.settled(bs.height * 0.15)) {
      fPos.target(iPos.target());
    }
  };

  const maybeLandDash = () => {
    let bs = boundsF();

    if (landDash && iPos.settled(bs.height * 0.02)) {
      landDash.shrink();
      landDash = undefined;
    }
  };

  this.update = delta => {
    iPos.update(delta * 0.01);
    fPos.update(delta * 0.01);
    iRot.update(delta * 0.001);
    maybeFollow();
    maybeLandDash();
  };

  this.render = (bounds) => {

    let worldPos = iPos.value();

    let screenPos = this
        .worldPos2ScreenPos(worldPos, bounds);

    let screenRotate = this
        .screenRotation();

    r.transform({
      rotate: screenRotate
    }, () => {
      r.transform({
        translate: screenPos
      }, () => {
        r.drawCircle(0, 0,
                     20);
      });
    });

  };
 
}
