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
  let nX = sWidth / tileSize;
  let nY = sHeight / tileSize;
  let nYY;

  let spikePath = SpikePath(tileSize);

  let lSpikes = new Pool(() => new Spike(lSpikes)),
      rSpikes = new Pool(() => new Spike(rSpikes));

  let spikeNoise = Noise();

  let ticker = new Ticker();

  let spikesVanished,
      vanishSpikes;

  this.data = {
    width: sWidth,
    height: sHeight
  };

  this.init = () => {

    nYY = 5;

    spikesVanished = false;
    vanishSpikes = lSpikes;

    lSpikes.releaseAll();
    rSpikes.releaseAll();

    for (let i = 0; i < nYY; i++) {
      let ii = Math.floor(spikeNoise(i, ticker.value()) * nY);


      if (ii === 0 || ii >= (nY - 2)) {
        ii = 1;
      }

      lSpikes.acquire(_ => _.init({
        y: tileSize * ii
      }));
      rSpikes.acquire(_ => _.init({
        y: tileSize * ii
      }));
    }

  };

  this.vanishSide = (side) => {
    spikesVanished = false;
    if (side === 'left') {
      vanishSpikes = lSpikes;
    } else {
      vanishSpikes = rSpikes;
    }
  };

  const maybeSpawnSpikes = delta => {
    
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

      vanishSpikes.acquire(_ => _.init({
        y: tileSize * ii
      }));
    }

  };

  this.update = delta => {

    ticker.update(delta);

    maybeSpawnSpikes(delta);

    lSpikes.each(_ => _.update(delta));
    rSpikes.each(_ => _.update(delta));

  };


  this.render = () => {

    lSpikes.each(({ data }) => {
      let { y, l } = data;
      r.transform({ 
        translate: [0 - l * tileSize, y],
        rotate: -u.PI * 0.5,
        w: tileSize,
        h: tileSize
      }, () => {
        renderSpike();
      });
    });

    rSpikes.each(({ data }) => {
      let { y, l } = data;
      r.transform({ 
        translate: [width - tileSize + l * tileSize, y],
        rotate: u.PI * 0.5,
        w: tileSize,
        h: tileSize
      }, () => {
        renderSpike();
      });
    });

    for (let i = 1; i < nX - 2; i++) {
      r.transform({ 
        translate: [i * tileSize, 0]
      }, () => {
        renderSpike();
      });
    }


    for (let i = 1; i < nX - 2; i++) {
      r.transform({ 
        translate: [i * tileSize, sHeight - tileSize],
        rotate: u.PI,
        w: tileSize,
        h: tileSize
      }, () => {
        renderSpike();
      });
    }
  };

  function renderSpike() {
    let shadow = 3;
    r.transform({
      translate: [-shadow, -shadow * 0.5]
    }, () => {
      r.fill(spikePath, 'black');
    });

    r.fill(spikePath, 'white');
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
      y: 0,
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
