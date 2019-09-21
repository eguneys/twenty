import * as mu from 'mutilz';

import Physics from '../physics';
import * as u from '../util';

import * as v from '../vector3';

export default function Bird(r, e, play) {

  const { width, height } = r.data;

  const { spikesWidth, spikesHeight, colours } = play.data;

  const { accent } = colours;

  let birdSize = 16;
  let hSpeed = 20;

  let birdPath = BirdPath(birdSize);

  let phy = new Physics({
    gravity: [0, 10, 0],
    friction: [0, 0, 0]
  });


  let spikeHit,
      dead;

  let inwards;

  this.init = () => {
    dead = 0;

    phy.pos({ x: spikesWidth * 0.5,
              y: spikesHeight * 0.5 });

    phy.vel({ x: hSpeed });

    phy.friction({ x: 0, y: 0 });
    phy.gravity({ y: 10 });

    this.dimensions = calculateDimensions(0);
  };


  this.update = delta => {

    this.dimensions = calculateDimensions(delta);

    // updateDebugMovement(delta);

    updateEdgeMath(delta);

    updateMovement(delta);

    updateCollisions(delta);

    maybeUpdateDead(delta);

    maybeGameOver(delta);

    phy.update(delta);
  };

  this.hitSpike = () => {
    if (!dead && !inwards) {
      spikeHit = true;
    }
  };

  const updateEdgeMath = delta => {
    
    let { after: dims } = this.dimensions;
    let vel = phy.vel({});

    let dX,
        closeXAxis;

    if (dims[0] < spikesWidth / 2) {
      dX = dims[0];
      closeXAxis = [0, 1];
    } else {
      dX = spikesWidth - dims[0];
      closeXAxis = [0, -1];
    }

    inwards = Math.sign(
      v.cross2(closeXAxis, [vel[0], vel[1]])) === 1;
  };

  const maybeUpdateDead = delta => {
    if (spikeHit) {
      spikeHit = false;
      dead = u.now();

      let vel = phy.vel({});
      phy.vel({ x: vel[0] * -1 * 4, y: -hSpeed });
      phy.friction({ x: -0.2, y: -0.1 });
      phy.gravity({ y: 1 });
    }
  };

  const maybeGameOver = delta => {
    if (dead !== 0) {
      u.ensureDelay(dead, () => {
        dead = 0;
        play.gameOver();
      }, 1000);
    }
  };

  const calculateDimensions = delta => {
    const { pos: posAfter } = phy.calculateUpdate(delta);
    const pos = phy.pos({});

    return {
      before: pos,
      after: posAfter,
      radius: birdSize
    };
  };

  const updateCollisions = delta => {

    let { after: dims } = this.dimensions;

    if (dims[0] - birdSize * 0.5 < 0) {
      play.score.increase();
      play.spikes.vanishSide('left');
      phy.vel({ x: hSpeed, y: -hSpeed });
    } else if (dims[0] + birdSize * 0.5 > spikesWidth) {
      play.score.increase();
      play.spikes.vanishSide('right');
      phy.vel({ x: -hSpeed, y: -hSpeed });
    }


    if (dims[1] - birdSize * 0.5 < 0) {
      phy.vel({ y: hSpeed });
    } else if (dims[1] + birdSize * 0.5 > spikesHeight) {
      phy.vel({ y: -hSpeed });
    }

  };

  const updateMovement = delta => {
    
    const { up } = e.data;

    if (dead) {
      return;
    }

    if (up) {
      phy.vel({ y: -hSpeed });
    }

  };

  const updateDebugMovement = delta => {
    const { up, down, left, right } = e.data;

    let speed = 10;

    if (up) {
      phy.force({ y: -speed });
    } else if (down) {
      phy.force({ y: speed });
    } else {
      phy.force({ y: 0 });
    }

    if (left) {
      phy.force({ x: -speed });
    } else if (right) {
      phy.force({ x: speed });
    } else {
      phy.force({ x: 0 });
    }



  };


  let tick = 0;
  this.render = () => {

    let { x, y, vx, vy } = phy.values();
    let angle = Math.atan2(vy, vx);

    let transform = {
      translate: [x,
                  y],
      rotate: angle,
      w: 0
    };

    r.transform(transform, () => {
      r.raw(ctx => {
        ctx.fillStyle = dead? 'black':accent.css();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, birdSize, mu.TAU * 0.02, mu.TAU * 0.98);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, birdSize * 0.3, 0, mu.TAU);
        ctx.fill();
      });
    });    
  };

}

function BirdPath(birdSize) {
  let res = new Path2D();

  res.arc(0, 0, birdSize, 0, mu.TAU);
  
  return res;
};
