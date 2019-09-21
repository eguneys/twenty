import Spikes from './spikes';
import Bird from './bird';
import Score from './score';

export default function Play(r, e) {

  const { width, height } = r.data;

  this.data = {
    spikesHeight: height * 0.6,
    spikesMin: Math.min(height * 0.6, width)
  };

  let spikes = this.spikes = new Spikes(r, this);
  let bird = this.bird = new Bird(r, e, this);

  let score = this.score = new Score(r, this);

  let { spikesHeight } = this.data;

  let state;

  this.init = () => {

    state = 'over';

    spikes.init();
    bird.init();
    score.init();

  };

  this.state = (_state = state) => {
    state = _state;
    return state;
  };

  const updateEvents = delta => {

    if (state === 'over') {
      if (e.data.up) {
        state = 'play';
      }
    } else {
      
    }

  };

  const maybeUpdatePlay = delta => {
    if (state === 'play') {
      spikes.update(delta);
      bird.update(delta);
      score.update(delta);
    }
  };

  this.update = delta => {
    updateEvents(delta);
    maybeUpdatePlay(delta);
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
