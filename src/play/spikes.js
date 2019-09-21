import Pool from 'poolf';
import * as u from 'mutilz';
import ipol from '../ipol';
import Noise from '../noise';
import Ticker from '../ticker';

export default function Spikes(r, play) {

  const { width, height } = r.data;

  let sWidth = width,
      sHeight = height * 0.6;

  let tileSize = 40;
  let spikeHeight = tileSize * 0.8;
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

  this.data = {
    width: sWidth,
    height: sHeight
  };

  this.init = () => {

    nYY = u.rand(4, 5);

    spikesVanished = false;
    vanishSide = 'left';

    lSpikes.releaseAll();
    rSpikes.releaseAll();

    for (let i = 0; i < nYY; i++) {
      let ii = Math.floor(spikeNoise(i, ticker.value()) * nY);


      if (ii === 0 || ii >= (nY - 2)) {
        continue;
      }

      let y = tileSize * ii;
      LeftSpike(y);
      RightSpike(y);
    }

    oSpikes = [];
    for (let i = 1; i < nX - 1; i++) {

      let x = tileSize * i;

      UpSpike(x);
      DownSpike(x);      
    }
  };

  this.vanishSide = (side) => {
    spikesVanished = false;
    vanishSide = side;
  };

  const RightSpike = (y) => {
    rSpikes.acquire(_ => _.init({
      points: [[sWidth, y - tileSize * 0.5],
               [sWidth, y + tileSize * 0.5],
               [sWidth - spikeHeight, y]]
    }));
  };

  const LeftSpike = (y) => {
    lSpikes.acquire(_ => _.init({
      points: [[0, y - tileSize * 0.5],
               [0, y + tileSize * 0.5],
               [spikeHeight, y]]
    }));
  };

  const UpSpike = x => {
    let spike = new Spike(null);
    spike.init({
      points: [[x - tileSize * 0.5, 0],
               [x + tileSize * 0.5, 0],
               [x, spikeHeight]]
    });
    oSpikes.push(spike);
    
  };

  const DownSpike = x => {
    let spike = new Spike(null);
    spike.init({
      points: [[x - tileSize * 0.5, sHeight],
               [x + tileSize * 0.5, sHeight],
               [x, sHeight - spikeHeight]]
    });
    oSpikes.push(spike);
  };

  const maybeSpawnSpikes = delta => {

    let vanishSpikes = vanishSide === 'left'?lSpikes:rSpikes;
    let VanishSpike = vanishSide === 'left'?LeftSpike:RightSpike;
    
    if (!spikesVanished) {
      spikesVanished = true;

      vanishSpikes.each(_ => {
        if (Math.random() < 0.5) {
          _.vanish();
        }
      });
    }

    for (let i = vanishSpikes.alives(); i < nYY; i++) {
      let ii = Math.floor(spikeNoise(i, ticker.value()) * nY);

      if (ii === 0 || ii >= (nY - 2)) {
        ii = 1;
      }

      vanishSpikes.acquire(_ => 
        _.init(VanishSpike(ii * tileSize)));
    }

  };

  const updateCollisions = delta => {

    let { after: dims, radius } = play.bird.dimensions;

    let oC = oSpikes.find(({ data }) => checkCollision(data.points, dims, radius));
    let lC = lSpikes.find(({ data }) => checkCollision(data.points, dims, radius));

    let rC = rSpikes.find(({ data }) => checkCollision(data.points, dims, radius));

    console.log(oC, lC, rC);

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
      r.drawPoints(points, 'black');
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
      points: [[0, 0]],
      l: 1,
      ...opts
    };
    this.data = opts;
  };

  this.vanish = () => {
    vanishing = true;
    iL.target(1.0);
  };

  const maybeVanish = () => {
    if (vanishing && iL.isSettled(0.01)) {
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
