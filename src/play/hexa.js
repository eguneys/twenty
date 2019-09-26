import * as mu from 'mutilz';
import * as co from 'colourz';
import * as rP from '../renderplus';

import * as u from './util';

export default function Hexa(ctx, play) {
  
  let { canvas: c, renderer: r, assets: a, events: e } = ctx;

  let color = new co.shifter(co.Palette.SwanWhite);

  let tiles;


  this.init = () => {

    tiles = {};

    u.bottomKeys.forEach(key => {
      tiles[key] = {
        number: mu.randInt(1, 5)
      };
    });
    
  };

  this.update = delta => {
    
  };

  let tileSize = 40;

  this.render = () => {

    r.drawRect(0, 0, u.cols * tileSize,
               u.rows * tileSize, color.css());


    u.allPos.forEach(pos => {
      let key = u.pos2key(pos),
          tile = tiles[key];

      let x = pos[0] * tileSize,
          y = pos[1] * tileSize;

      r.transform({
        translate: [x, y]
      }, () => {

        if (tile) {
          let { number } = tile;
          renderHexa(tileSize, number);
        }
      });

    });
  };

  const colours = {
    1: new co.shifter(co.Palette.Mandarin).base(),
    2: new co.shifter(co.Palette.FluRed).base(),
    3: new co.shifter(co.Palette.CelGreen).base(),
    4: new co.shifter(co.Palette.Blue).base(),
    5: new co.shifter(co.Palette.LuckyP).base()
  };

  const renderHexa = (size, number) => {

    let color = colours[number];

    let margin = size * 0.02;

    let primary = color
        .reset()
        .lum(0.5)
        .css();
    let highlight = color
        .reset()
        .lum(0.7)
        .css();
    let shadow = color
        .reset()
        .lum(0.3)
        .css();

    r.raw(rP.hexa(margin, margin,
                  size - margin * 2.0, primary, highlight, shadow));

    r.drawText(size * 0.5 - margin, size * 0.5, {
      align: 'center',
      baseline: 'middle',
      size: size - margin * 16.0,
      text: number + ""
    }, 'white');
    
  };

}
