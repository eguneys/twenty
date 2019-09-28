import * as co from 'colourz';
import * as mu from 'mutilz';
import ipol from '../ipol';
import { interpolator2 as ipol2 } from '../ipol';
import * as v2 from '../vector2';

export default function Camera(ctx, hexa) {

  let { canvas: c, renderer: r, assets: a, events: e } = ctx;

  let color = new co.shifter(co.Palette.Mandarin).lum(0.5).base();

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

  let prevDash,
      landDash;
  let dashInProgress;

  let dieScale;

  this.init = () => {
    dieScale = 1;
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


  this.heroScreenPos = () => {
    let worldPos = iPos.value();

    return this
      .worldPos2ScreenPos(worldPos, boundsF());
  };


  this.addTarget = (dash) => {
    let target = dash.position();
    if (!iPos) {
      iPos = new ipol2([target.x, target.y]);
      fPos = new ipol2([target.x, target.y]);
      prevDash = dash;
      dash.shrink();
    } else {
      targets.push(dash);
    }
  };

  let landSameDash;

  this.dash = () => {

    if (dashInProgress) {
      return;
    }

    if (landSameDash) {
      landSameDash = false;
    } else {
      landDash = targets.shift();
    }

    dashInProgress = true;

    let t = landDash.position();

    iPos.target([t.x, t.y]);

    iRot.target(mu.rand(-mu.TAU * 0.06, mu.TAU * 0.06));
  };

  this.dashBack = (die) => {
    if (dashInProgress) {

      hexa.hit(die);

      if (die) {
        iRot.target(mu.rand(-mu.TAU * 0.06, mu.TAU * 0.06));
        dieScale = 0.5;
        color.hsb([0, 60, 10]).base();
      }

      dashInProgress = false;
      landSameDash = true;
      let t = prevDash.position();
      iPos.target([t.x, t.y]);
    }
  };

  const maybeFollow = () => {
    let bs = boundsF();
    if (iPos.settled(bs.height * 0.15)) {
      fPos.target(iPos.target());
    }
  };

  const maybeLandDash = () => {
    let bs = boundsF();

    if (dashInProgress && iPos.settled(bs.height * 0.02)) {
      landDash.shrink();
      prevDash = landDash;
      dashInProgress = false;
    }
  };

  this.update = delta => {
    iPos.update(delta * 0.01);
    fPos.update(delta * 0.01);
    iRot.update(delta * 0.001);
    maybeFollow();
    maybeLandDash();
  };

  this.heroPos = () => heroPos;

  let heroPos = [0, 0];
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
        r.raw(ctx => {
          heroPos = [ctx.currentTransform.e,
                     ctx.currentTransform.f];
        });

        r.drawCircle(0, 0,
                     bounds.hRadius, color.reset().css());
      });
    });
  };
 
}
