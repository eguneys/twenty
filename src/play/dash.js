import * as mu from 'mutilz';
import * as co from 'colourz';
import * as rP from '../renderplus';

import Ticker from '../ticker';
import ipol from '../ipol';

export default function Dash(ctx, hexa) {
  
  let { renderer: r, assets: a, events: e } = ctx;

  let colEdge = new co.shifter(co.Palette.CrocTooth).lum(0.3).base();

  let pos;

  let iRadius;

  let ring;

  let ticker = new Ticker();

  this.init = (opts) => {
    opts = {
      x: 0,
      y: 0,
      ...opts
    };

    ring = {
      width: mu.rand(mu.TAU * 0.1, mu.TAU * 0.4),
      offset: mu.rand(0, mu.TAU),
      speed: mu.rand(0.8, 1) * Math.sign(mu.rand(1, -1))
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
    ticker.update(delta);
    if (iRadius) {
      iRadius.update(delta * 0.0006);
    }
  };

  this.render = (bounds) => {

    let camera = hexa.camera;

    let sPos = camera.worldPos2ScreenPos([pos.x, pos.y], bounds);

    let screenRotate = camera
        .screenRotation();

    let heroPos = camera.heroPos();

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
        } else {

          let wStroke = bounds.height * 0.01;
          
          r.raw(rP.halfCircle(0, 0, bounds.radius, mu.TAU, wStroke, colEdge.reset().css()));

          let rWidth = ring.width,
              rOffset = ring.offset,
              rSpeed = ring.speed;

          let tick = ticker.value(rSpeed);

          r.transform({
            rotate: tick % mu.TAU + rOffset,
            w: 0
          }, () => {

            r.raw(rP.halfCircle(0, 0, bounds.radius, rWidth, wStroke * 4.0, colEdge.reset().css()));

            r.raw(ctx => {

              ctx.lineWidth = wStroke * 4.0;

              ctx.beginPath();
              ctx.arc(0, 0, bounds.radius, 0, rWidth);

              let hit = r.isPointInStroke(heroPos[0], heroPos[1]);
              
              if (hit) {

                camera.dashBack();

              }
            });

          });
        }
      });
    });
  };

}
