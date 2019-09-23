import * as mu from 'mutilz';
import * as co from 'colourz';

export default function Ground(ctx, play) {
  
  let { renderer: r, assets: a, events: e, colors } = ctx;

  const colBg = colors.darkBackground.copy();

  let tiles;
  let drag;

  this.init = () => {
    
    tiles = {};

    bottomKeys.forEach(key => {
      tiles[key] = {
        number: mu.randInt(1, 5)
      };
    });
  };

  this.liftTiles = () => {
    bottomKeys.forEach(key => {
      tiles[key] = {
        number: 1
      };
    });
  };

  this.update = delta => {
    updateDrag();
  };

  const updateDrag = () => {
    let { current } = e.data;

    if (current) {
      if (current.ending) {
        endDrag();
      } else if (current.tile) {
        let tile = tiles[current.tile];

        if (tile && !drag) {
          startDrag(current.tile, current.epos2);
        }
      }
    }

    if (drag) {
      moveDrag(current.tile, current.epos2);
    }
  };

  const startDrag = (key, pos) => {
    let tile = tiles[key];
    drag = { org: key, dest: key, tile, pos };
    delete tiles[key];
  };

  const endDrag = () => {
    if (drag) {
      tiles[drag.dest] = drag.tile;

      drag = undefined;
    }
  };

  const moveDrag = (key, pos) => {
    drag.pos = pos;
    drag.dest = key;
  };

  this.renderDragLayer = (bounds) => {
    if (drag) {
      r.transform({
        translate: [drag.pos.x - bounds.tileSize * 0.5,
                    drag.pos.y - bounds.tileSize * 0.5]
      }, () => {
        renderTile(bounds.tileSize, drag.tile.number);
      });
    }
  };

  this.render = (bounds) => {
    
    r.roundedRect(0, 0,
                  bounds.width, 
                  bounds.height, 30,  colBg.css());

    allPos.forEach(pos => {
      let key = pos2key(pos),
          tile = tiles[key];

      r.transform({
        translate: [pos[0] * bounds.tileSize, pos[1] * bounds.tileSize]
      }, () => {

        let current = e.data.current;

        if (current) {
          let hitTile = r.checkBounds({
            x: 0,
            y: 0,
            width: bounds.tileSize,
            height: bounds.tileSize
          }, current.epos.x, current.epos.y);

          if (hitTile) {
            console.log(pos[1] * bounds.tileSize, current.epos2.y);
            current.tile = key;
          }
        }        

        if (tile) {
          renderTile(bounds.tileSize, tile.number);
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

  const renderTile = (size, number) => {
    let margin = size * 0.02;

    let color = colours[number];

    r.roundedRect(margin, margin,
                  size - margin * 2.0, size - margin * 2.0, margin * 10.0,
                  color
                  .reset()
                  .lum(0.42).css());

    r.roundedRect(margin, margin,
                  size - margin * 2.0, size - margin * 6.0, margin * 10.0, 
                  color
                  .reset()
                  .lum(0.62).css());

    r.drawText(size * 0.5, size * 0.5, {
      align: 'center',
      baseline: 'middle',
      size: size - margin * 16.0,
      text: number + ""
    }, number === 1 ? 'black': 'white');
                  
  };

}

export const rows = 10;
export const cols = 8;

export const allPos = (function() {
  const res = [];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      res.push([j, i]);
    }
  }
  return res;
})();

export const bottomRow = (function() {
  const res = [];
  for (let i = 0 ; i < cols; i++) {
    res.push([i, rows - 1]);
  }
  return res;
})();

export const bottomKeys = bottomRow.map(pos2key);

export function pos2key(pos) {
  return pos[0] + '.' + pos[1];
};

export function key2pos(key) {
  return key.split('.').map(_ => parseInt(_));
}
