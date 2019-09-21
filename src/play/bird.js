import * as mu from 'mutilz';

import Physics from '../physics';
import * as u from '../util';

export default function Bird(r, e, play) {

  const { width, height } = r.data;

  const { height: spikesHeight } = play.spikes.data;

  let birdSize = 20;

  let birdPath = BirdPath(birdSize);

  let phy = new Physics({
    gravity: [0, 0, 0]
  });

  let colour = 'black';
  
  this.init = () => {
    phy.pos({ x: width * 0.5,
              y: spikesHeight * 0.5 });
  };


  this.update = delta => {

    updateDebugMovement(delta);

    phy.update(delta);


    colour = 'black';
  };

  this.dimensions = (delta) => {
    const { pos: posAfter } = phy.calculateUpdate(delta);
    const pos = phy.pos({});

    return {
      before: pos,
      after: posAfter,
      radius: birdSize
    };
  };

  this.hitSpike = () => {
    colour = 'blue';
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

    let { x, y } = phy.values();

    let transform = {
      translate: [x,
                  y],
      w: birdSize
    };

    r.transform(transform, () => {
      r.fill(birdPath, colour);
    });    
  };

}

function BirdPath(birdSize) {
  let res = new Path2D();

  res.arc(0, 0, birdSize, 0, mu.TAU);
  
  return res;
};
