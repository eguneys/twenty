import * as eve from './events';
import * as can from './canvas';

import Loop from 'loopz';
import Events from './events';
import Canvas from './canvas';
import Assets from './assets';
import Renderer from './renderer';
import Colors from './colors';
import Play from './play';

export function app(element, options) {

  const canvas = new Canvas(element);

  can.bindResize(canvas);

  const events = new Events(canvas);

  eve.bindTouch(events.data);
  
  const renderer = new Renderer(canvas);

  const colors = Colors();

  new Assets({
    'icon-play': 'assets/play-xxl.png'
  }).start()
    .then(assets => {

      const context = {
        canvas,
        events,
        renderer,
        assets,
        colors
      };

      const play = new Play(context);

      play.init();

      new Loop(delta => {
        delta = Math.min(delta, 18);
        events.update(delta);
        play.update(delta);
        play.render();
      }, 60).start();
    });

  return {};
}
