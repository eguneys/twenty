import * as mu from 'mutilz';

import Physics from '../physics';
import * as u from '../util';

export default function Bird(r, play) {

  const { width, height } = r.data;

  const { height: spikesHeight } = play.spikes.data;

  let birdSize = 20;

  let birdPath = BirdPath(birdSize);

  let phy = new Physics();
  
  this.init = () => {
    phy.pos({ x: width * 0.5,
              y: spikesHeight * 0.5 });
  };


  this.update = delta => {


  };


  this.render = () => {

    let { x, y } = phy.values();

    let transform = {
      translate: [x,
                  y],
      w: birdSize
    };

    r.transform(transform, () => {
      r.fill(birdPath);
    });    
  };

}

function BirdPath(birdSize) {
  let res = new Path2D();

  res.arc(0, 0, birdSize, 0, mu.TAU);
  
  return res;
};
