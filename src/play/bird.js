import * as mu from 'mutilz';

import Physics from '../physics';
import * as u from '../util';

export default function Bird(r, e, play) {

  const { width, height } = r.data;

  const { spikesHeight } = play.data;

  let birdSize = 20;

  let birdPath = BirdPath(birdSize);

  let phy = new Physics({
    gravity: [0, 10, 0],
    friction: [0, 0, 0]
  });

  let colour = 'black';
  
  let hSpeed = 20;

  this.init = () => {
    phy.pos({ x: width * 0.5,
              y: spikesHeight * 0.5 });

    phy.vel({ x: hSpeed });

    this.dimensions = calculateDimensions(0);
  };


  this.update = delta => {

    this.dimensions = calculateDimensions(delta);

    // updateDebugMovement(delta);

    updateMovement(delta);

    updateCollisions(delta);

    phy.update(delta);


    colour = 'black';
  };

  this.hitSpike = () => {
    colour = 'blue';
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
    } else if (dims[0] + birdSize * 0.5 > width) {
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


  this.render = () => {

    let { x, y, vx, vy } = phy.values();
    let angle = Math.atan2(vy, vx);

    let transform = {
      translate: [x,
                  y],
      rotate: angle,
      w: birdSize * 0.5
    };

    r.transform(transform, () => {
      r.raw(ctx => {
        ctx.fillStyle = 'black';
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
