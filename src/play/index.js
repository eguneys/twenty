import Spikes from './spikes';
import Bird from './bird';

export default function Play(r, e) {

  const { width, height } = r.data;

  let spikes = this.spikes = new Spikes(r, this);

  let bird = this.bird = new Bird(r, this);
  
  const { height: spikesHeight } = spikes.data;

  this.init = () => {

    spikes.init();
    bird.init();

  };

  this.update = delta => {
    spikes.update(delta);
    bird.update(delta);
  };


  this.render = () => {
    r.clear();

    let spikesTop = height * 0.13;

    r.transform({
      translate: [0, spikesTop]
    }, () => {
      bird.render();
      spikes.render();
    });

    r.drawRect(0, 0, width, spikesTop);
    r.drawRect(0, spikesTop + spikesHeight, width, height);
  };

}
