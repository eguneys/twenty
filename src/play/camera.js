import Pool from 'poolf';
import * as co from 'colourz';
import * as mu from 'mutilz';
import ipol from '../ipol';
import { interpolator2 as ipol2 } from '../ipol';
import * as v2 from '../vector2';

import Ticker from '../ticker';

import * as rP from '../renderplus';
import * as u from '../util';

export default function Camera(ctx, hexa) {

  const { canvas: c, renderer: r, assets: a, events: e } = ctx;

  const boundsF = c.responsiveBounds(({ width, height }) => {
    return {
      width,
      height,
      radius: width * 0.22
    };
  });

  const trails = new Pool(() => new Trail(ctx, this, trails));

  let color;

  let iPos;
  let targets;
  let fPos;
  let iRot;

  let prevDash,
      landDash;
  let dashInProgress;
  let landSameDash;

  let dieScale;


  let trailPoss,
      lastTrailPos;

  this.init = () => {
    color = new co.shifter(co.Palette.Mandarin).lum(0.5).base();
    dieScale = 1;

    trails.releaseAll();
    trailPoss = [];
    lastTrailPos = undefined;

    iRot = new ipol(0);
    iPos = undefined;
    targets = [];
    landSameDash = false;
    prevDash = undefined;
    landDash = undefined;
    dashInProgress = false;
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

  const maybeSpawnTrail = u.withDelay(() => {
    let worldPos = iPos.value().slice(0);

    if (lastTrailPos) {
      if (Math.abs(lastTrailPos[1] - worldPos[1]) > 1) {
        trailPoss.push(lastTrailPos);
      };
    }

    if (trailPoss.length > 2) {

      trails.acquire(_ => _.init({
        from: trailPoss[1],
        to: trailPoss[0]
      }));

      if (trails.alives() > 30) {
        trails.releaseLast();
      }

      trailPoss = [];
    }

    lastTrailPos = worldPos;
  }, 10);

  this.update = delta => {
    iPos.update(delta * 0.01);
    fPos.update(delta * 0.01);
    iRot.update(delta * 0.001);
    maybeFollow();
    maybeLandDash();
    maybeSpawnTrail(delta);

    trails.each(_ => _.update(delta));
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
      trails.each(_ => _.render(bounds, color.reset()));

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


function Trail(ctx, camera, pool) {


  const { renderer: r } = ctx;

  let from, to;

  let life = new Ticker();
  
  this.init = (opts) => {
    from = opts.from;
    to = opts.to;
    life.reset();
  };

  this.update = delta => {
    life.update(delta);

    if (life.value() > 300) {
      pool.release(this);
    }
  };


  this.render = (bounds, color) => {

    let xOffset = bounds.width * 0.03,
        lW = xOffset * 0.8;
    
    let sFrom = camera.worldPos2ScreenPos(from, bounds),
        sTo = camera.worldPos2ScreenPos(to, bounds);
    
    r.raw(rP.line(sFrom[0], sFrom[1], sTo[0], sTo[1], color.css(), lW));
    r.raw(rP.line(sFrom[0] + xOffset, sFrom[1], sTo[0] + xOffset, sTo[1], color.css(), lW));
    r.raw(rP.line(sFrom[0] - xOffset, sFrom[1], sTo[0] - xOffset, sTo[1], color.css(), lW));
    
  };

}
