import Spikes from './spikes';
import Bird from './bird';
import Score from './score';

export default function Play(r, e) {

  const { width, height } = r.data;

  this.data = {
    spikesHeight: height * 0.6
  };

  let spikes = this.spikes = new Spikes(r, this);
  let bird = this.bird = new Bird(r, e, this);

  let score = this.score = new Score(r, this);

  let { spikesHeight } = this.data;

  this.init = () => {

    spikes.init();
    bird.init();
    score.init();

  };

  this.update = delta => {
    spikes.update(delta);
    bird.update(delta);
    score.update(delta);
  };


  this.render = () => {
    r.clear();

    let spikesTop = height * 0.13;

    r.transform({
      translate: [0, spikesTop]
    }, () => {
      score.render();
      bird.render();
      spikes.render();
    });

    r.drawRect(0, 0, width, spikesTop);
    r.drawRect(0, spikesTop + spikesHeight, width, height);
  };

}
