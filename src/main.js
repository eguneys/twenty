import * as eve from './events';

import Loop from 'loopz';
import Events from './events';
import Canvas from './canvas';
import Renderer from './renderer';
import Play from './play';

export function app(element, options) {

  const canvas = new Canvas(element);

  const events = new Events(canvas);

  eve.bindKeyboard(events.data);
  eve.bindTouch(events.data);
  
  const renderer = new Renderer(canvas);

  const play = new Play(renderer, events);

  play.init();

  new Loop(delta => {
    delta = Math.min(delta, 18);
    events.update(delta);
    play.update(delta);
    play.render();
  }, 60).start();

  return {};
}
