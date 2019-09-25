import Hexa from './hexa';
import Twenty from './twenty';
import Menu from './menu';
import * as co from 'colourz';

export default function Play(ctx) {

  let { canvas: c, renderer: r, assets: a, events: e } = ctx;

  const boundsF = c.responsiveBounds(({ width, height }) => {
    return {
      width,
      height
    };
  });

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
    if (state === 'twenty') {
      twenty.update(delta);
    }
    if (state === 'hexa') {
      hexa.update(delta);
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
    const { width, height } = boundsF();

    r.clear(width, height, bgColor.css());

    if (state === 'menu') {
      menu.render();
    } else if (state === 'twenty') {
      twenty.render();
    } else if (state === 'hexa') {
      hexa.render();
    }
  };

}
