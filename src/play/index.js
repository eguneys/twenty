import Twenty from './twenty';
import Menu from './menu';
import * as co from 'colourz';

export default function Play(ctx) {

  let { renderer: r, assets: a, events: e } = ctx;

  const { width, height } = r.data;

  this.data = {
    colours: {
      accent: new co.shifter(co.Palette.FluRed).lum(0.63).base(),
      background: new co.shifter(co.Palette.CrocTooth).lum(0.95).base()
    }
  };

  const menu = new Menu(ctx, this);

  const twenty = new Twenty(ctx, this);

  let bgColor = this.data.colours.background;

  let state;

  this.init = (opts = {}) => {
    state = 'twenty';

    twenty.init();
    menu.init();
  };

  this.state = (_state = state) => {
    state = _state;
    return state;
  };

  const updateEvents = delta => {

    if (state === 'menu') {

    } else {

    }

  };

  const maybeUpdatePlay = delta => {
    if (state === 'play') {
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
    r.clear(bgColor.css());

    if (state === 'menu') {
      menu.render();
    } else if (state === 'twenty') {
      twenty.render();
    }
  };

}
