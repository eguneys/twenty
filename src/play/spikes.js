import Pool from 'poolf';
import * as mu from 'mutilz';
import ipol from '../ipol';
import Noise from '../noise';
import Ticker from '../ticker';

export default function Spikes(r, play) {

  const { width, height } = r.data;

  const { spikesWidth, spikesHeight, colours } = play.data;

  let bgColor = colours.background;

  let sWidth = spikesWidth,
      sHeight = spikesHeight;

  let tileSize = 80;
  let spikeWidth = tileSize * 0.7;
  let spikeHeight = tileSize * 0.6;
  let nX = sWidth / tileSize;
  let nY = sHeight / tileSize;
  let nYY;

  let spikePath = SpikePath(tileSize);

  let lSpikes = new Pool(() => new Spike(lSpikes)),
      rSpikes = new Pool(() => new Spike(rSpikes));

  let oSpikes;

  let spikeNoise = Noise();

  let ticker = new Ticker();

  let spikesVanished,
      vanishSide;

  this.init = () => {

    nYY = mu.rand(4, 6);

    spikesVanished = false;
    vanishSide = 'left';

    lSpikes.releaseAll();
    rSpikes.releaseAll();

    oSpikes = [];
    for (let i = 0; i < nX - 1; i++) {

      let x = tileSize * i + tileSize * 0.75;

      UpSpike(x);
      DownSpike(x);      
    }

    fillSpikes('left');
    fillSpikes('right');
  };

  this.vanishSide = (side) => {
    spikesVanished = false;
    vanishSide = side;
  };

  const RightSpike = (ii) => {
    let y = ii * tileSize;
    rSpikes.acquire(_ => _.init({
      ii,
      points: [[sWidth, y - spikeWidth * 0.5 * 0.5],
               [sWidth, y + spikeWidth * 0.5 * 0.5],
               [sWidth - spikeHeight * 0.5, y]]
    }));
  };

  const LeftSpike = (ii) => {
    let y = ii * tileSize;
    lSpikes.acquire(_ => _.init({
      ii,
      points: [[0, y - spikeWidth * 0.5 * 0.5],
               [0, y + spikeWidth * 0.5 * 0.5],
               [spikeHeight * 0.5, y]]
    }));
  };

  const UpSpike = x => {
    let spike = new Spike(null);
    spike.init({
      points: [[x - spikeWidth * 0.5 * 0.5, 0],
               [x + spikeWidth * 0.5 * 0.5, 0],
               [x, spikeHeight * 0.5]]
    });
    oSpikes.push(spike);
    
  };

  const DownSpike = x => {
    let spike = new Spike(null);
    spike.init({
      points: [[x - spikeWidth * 0.5 * 0.5, sHeight],
               [x + spikeWidth * 0.5 * 0.5, sHeight],
               [x, sHeight - spikeHeight * 0.5]]
    });
    oSpikes.push(spike);
  };


  const maybeSpawnSpikes = delta => {

    let vanishSpikes = vanishSide === 'left'?lSpikes:rSpikes;
    let VanishSpike = vanishSide === 'left'?LeftSpike:RightSpike;

    if (!spikesVanished) {
      spikesVanished = true;

      vanishSpikes.each(_ => {
        if (Math.random() < 0.9) {
          _.vanish();
        }
      });
    }

    fillSpikes(vanishSide);
  };

  const fillSpikes = vanishSide => {
    let vanishSpikes = vanishSide === 'left'?lSpikes:rSpikes;
    let VanishSpike = vanishSide === 'left'?LeftSpike:RightSpike;

    let usedIs = [];
    vanishSpikes.each(_ => usedIs.push(_.data.ii));

    nYY = mu.rand(2, 3);

    for (let i = vanishSpikes.alives(); i < nYY; i++) {

      let ii, used;

      do {
        ii = Math.floor(Math.random() * nY);
        used = usedIs.indexOf(ii) !== -1;
      } while ((ii === 0 || ii >= (nY - 1)) && !used);

      usedIs.push(ii);

      VanishSpike(ii);
    }
  };

  const updateCollisions = delta => {

    let { after: dims, radius } = play.bird.dimensions;

    let oC = oSpikes.find(({ data }) => checkCollision(data.points, dims, radius));
    let lC = lSpikes.find(({ data }) => checkCollision(data.points, dims, radius));

    let rC = rSpikes.find(({ data }) => checkCollision(data.points, dims, radius));

    if (oC) {
      play.bird.hitSpike();
    } else if (lC) {
      play.bird.hitSpike();
    } else if (rC) {
      play.bird.hitSpike();
    }

  };

  const checkCollision = (points, dims, radius) =>
        points.some(point => intersect(dims, radius, point));

  function intersect(center, radius, b) {
    let d2 = Math.pow(center[0] - b[0], 2) +
        Math.pow(center[1] - b[1], 2),
        r2 = Math.pow(radius, 2);
    return d2 < r2;
  }

  this.update = delta => {

    ticker.update(delta);

    maybeSpawnSpikes(delta);

    updateCollisions(delta);

    lSpikes.each(_ => _.update(delta));
    rSpikes.each(_ => _.update(delta));

  };

  this.render = () => {

    lSpikes.each(({ data }) => {
      let { points, l } = data;
      r.transform({
        translate: [-l * tileSize, 0]
      }, () => {
        renderSpike(points);
      });
    });
    
    rSpikes.each(({ data }) => {
      let { points, l } = data;
      
      r.transform({
        translate: [l * tileSize, 0]
      }, () => {
        renderSpike(points);
      });
    });

    oSpikes.forEach(({ data }) => {
      renderSpike(data.points);
    });

  };


  function renderSpike(points) {
    let shadow = 3;
    r.transform({
      translate: [shadow * 0.1, shadow * 0.1]
    }, () => {
      r.drawPoints(points, bgColor.css());
    });

    r.drawPoints(points, 'white');
  }
}

export function Spike(pool) {

  let vanishing;

  let iL = new ipol(0.0);

  this.init = (opts) => {
    vanishing = false;
    iL.value(1.0);
    iL.target(0.0);
    opts = {
      // points: [[0, 0]],
      l: 1,
      ...opts
    };
    if (!opts.points) {
      debugger;
    }
    this.data = opts;
  };

  this.vanish = () => {
    vanishing = true;
    iL.target(1.0);
  };

  const maybeVanish = () => {
    if (vanishing && iL.settled(0.01)) {
      pool.release(this);
    }
  };

  this.update = delta => {
    maybeVanish();

    iL.update(delta*0.01 * 0.8);

    this.data.l = iL.value();
  };
};

export function SpikePath(tileSize) {
  const res = new Path2D();

  res.moveTo(0, 0);
  res.lineTo(tileSize * 0.5, tileSize * 0.8);
  res.lineTo(tileSize, 0);
  
  return res;
};
