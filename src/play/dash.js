import * as mu from 'mutilz';
import * as co from 'colourz';
import * as rP from '../renderplus';

import Ticker from '../ticker';
import ipol from '../ipol';

export default function Dash(ctx, hexa) {
  
  let { renderer: r, assets: a, events: e } = ctx;

  let colEdge = new co.shifter(co.Palette.CrocTooth).lum(0.3).base();

  let colRing = new co.shifter(co.Palette.CelGreen).lum(0.5).base();

  let iFlash = new ipol(0.0);

  let dieScale;
  let pos;

  let iRadius;

  let ring;

  let ticker = new Ticker();

  this.init = (opts) => {
    dieScale = 1;
    opts = {
      x: 0,
      y: 0,
      ...opts
    };

    ring = {
      die: false,
      color: colRing.copy(),
      thickness: 2.0,
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
    iFlash.value(0.2);
  };

  this.die = () => {
    colRing.sat(0.1).base();
    ring.color.sat(0.1).base();
  };

  const updateColors = delta => {
    iFlash.update(delta * 0.01);

    colEdge.lum(0.5 + iFlash.value()).base();
  };

  this.update = delta => {
    updateColors(delta);
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

          r.drawCircle(0, 0, iRadius.value() * bounds.radius * 1.2, 
                       colEdge.reset().css());
        } else {

          let wStroke = bounds.height * 0.01;
          
          r.raw(rP.halfCircle(0, 0, bounds.radius, mu.TAU, wStroke, colEdge.reset().css()));

          let rWidth = ring.width,
              rOffset = ring.offset,
              rThickness = ring.thickness,
              rSpeed = ring.speed,
              rColor = ring.color;

          let tick = ticker.value(rSpeed);

          r.transform({
            rotate: tick % mu.TAU + rOffset,
            w: 0
          }, () => {

            r.raw(rP.halfCircle(0, 0, bounds.radius, rWidth, wStroke * rThickness, rColor.reset().css()));

            r.raw(ctx => {

              ctx.lineWidth = wStroke * 4.0;

              ctx.beginPath();
              ctx.arc(0, 0, bounds.radius, 0, rWidth);


              let cps = circlePoints(heroPos[0], heroPos[1], bounds.hRadius);

              for (let p of cps) {
                let hit = r.isPointInStroke(p[0], p[1]);
                if (hit) {
                  camera.dashBack(ring.die);

                  ring.die = true;
                  ring.thickness = 4.0;
                  ring.color.hsb([0, 70, 50]).base();

                  break;
                }
              };
            });

          });
        }
      });
    });
  };

}

function circlePoints(x, y, radius) {
  let res = [];

  for (let i = 0; i < 10; i++) {
    let a = mu.TAU * (i / 10);
    let xi = Math.cos(a) * radius,
        yi = Math.sin(a) * radius;

    res.push([x + xi, y + yi]);    
  }
  
  return res;
}
