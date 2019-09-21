import Spikes from './spikes';
import Bird from './bird';
import Score from './score';
import Menu from './menu';
import * as co from 'colourz';

export default function Play(r, e) {

  const { width, height } = r.data;

  const spikesWidth = width * 0.98,
        spikesHeight = height * 0.6;

  this.data = {
    spikesWidth,
    spikesHeight,
    spikesMin: Math.min(height * 0.6, width),
    colours: {
      accent: new co.shifter(co.Palette.FluRed).lum(0.63),
      background: new co.shifter(co.Palette.CrocTooth).lum(0.3)
    }
  };

  let bgColor = this.data.colours.background;

  let spikes = this.spikes = new Spikes(r, this);
  let bird = this.bird = new Bird(r, e, this);

  let score = this.score = new Score(r, this);
  let menu = this.menu = new Menu(r, this);

  let highScore;

  let state;

  this.init = (opts = {}) => {

    opts = {
      highScore: 0,
      ...opts
    };

    state = 'menu';
    highScore = opts.highScore;

    spikes.init();
    bird.init();
    score.init();
    menu.init({ highScore });
  };

  this.state = (_state = state) => {
    state = _state;
    return state;
  };

  this.gameOver = () => {
    let currentScore = score.score();

    if (currentScore > highScore) {
      this.init({
        highScore: currentScore
      });
    } else {
      this.init({});
    }
  };

  const updateEvents = delta => {

    if (state === 'menu') {
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
    if (state === 'menu') {
      menu.update(delta);
    }
  };

  this.update = delta => {
    updateEvents(delta);
    maybeUpdatePlay(delta);
  };


  this.render = () => {
    r.clear();

    let spikesLeft = (width - spikesWidth) * 0.5,
        spikesTop = height * 0.13;

    r.transform({
      translate: [spikesLeft, spikesTop]
    }, () => {
      score.render();
      bird.render();
      spikes.render();

      if (state === 'menu') {
        menu.render();
      }
    });

    r.drawRect(0, spikesTop, spikesLeft, spikesHeight, bgColor.css());
    r.drawRect(spikesLeft + spikesWidth, spikesTop, spikesLeft, spikesHeight, bgColor.css());
    r.drawRect(0, 0, width, spikesTop, bgColor.css());
    r.drawRect(0, spikesTop + spikesHeight, width, height, bgColor.css());
  };

}
