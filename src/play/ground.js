import { objForeach } from 'outilz';
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
    maybeMergeDrag();
  };

  const maybeMergeDrag = () => {

    if (drag) {
      let { org, dest, tile: orgTile } = drag;

      let destTile = tiles[dest];

      if (org !== dest && orgTile && destTile && mergable(orgTile, destTile)) {
        mergeDrag();
      }
    }

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
      moveDrag(current.tile, current.epos2, current.hitTiles);
    }
  };

  const startDrag = (key, pos) => {
    let tile = tiles[key];
    drag = { org: key, dest: key, tile, pos };
    delete tiles[key];
  };

  const endDrag = () => {
    if (drag && !drag.merged) {
      console.log('endDrag');
      if (drag.dest) {
        tiles[drag.dest] = drag.tile;
      }
    }

    drag = undefined;
  };

  const mergeDrag = (dest) => {

    const { tile } = drag;

    if (dest) {
      tiles[dest] = incrementTile(tile);
    }

    drag.merged = true;
  };

  const moveDrag = (key, pos, hitTiles) => {
    if (drag && !drag.merged) {

      let { dest } = drag;

      let hitLeftBottom = tiles[hitTiles['leftbottom']],
          hitRightBottom = tiles[hitTiles['rightbottom']],
          hitLeftTop = tiles[hitTiles['lefttop']],
          hitRightTop = tiles[hitTiles['righttop']];

      let vX = pos.x - drag.pos.x,
          vY = pos.y - drag.pos.y;

      if ((hitLeftBottom || hitLeftTop) ||
          (hitRightBottom || hitRightTop)) {
        vX = 0;
      }

      if ((hitLeftBottom || hitRightBottom) ||
          (hitLeftTop || hitRightTop)) {
        vY = 0;
      }

      let dragPosX = drag.pos.x + vX;
      let dragPosY = drag.pos.y + vY;

      drag.pos = {
        x: dragPosX,
        y: dragPosY
      };
      drag.dest = key;
    }
  };


  const hitTiles = {
    'leftbottom': [-1, 1],
    'rightbottom': [1, 1],
    'lefttop': [-1, -1],
    'righttop': [1, -1]
  };

  this.render = (bounds) => {
    
    r.roundedRect(0, 0,
                  bounds.width, 
                  bounds.height, 30,  colBg.css());

    
    let current = e.data.current;
    if (current) {
      current.hitTiles = {};
    }
    
    allPos.forEach(pos => {
      let key = pos2key(pos),
          tile = tiles[key];

      r.transform({
        translate: [pos[0] * bounds.tileSize, pos[1] * bounds.tileSize]
      }, () => {

        if (current) {
          let hitTile = r.checkBounds({
            x: 0,
            y: 0,
            width: bounds.tileSize,
            height: bounds.tileSize
          }, current.epos.x, current.epos.y);

          if (hitTile) {
            current.tile = key;
          }
        }

        if (drag) {
          objForeach(hitTiles, (hitKey, hitDir) => {
            let hitTile = r.checkBounds({
              x: 0,
              y: 0,
              width: bounds.tileSize,
              height: bounds.tileSize
            }, drag.pos.x * bounds.pixelRatio + hitDir[0] * bounds.tileSize,
               drag.pos.y * bounds.pixelRatio + hitDir[1] * bounds.tileSize);

            if (hitTile) {
              current.hitTiles[hitKey] = key;
            }
          });
        }

        if (tile) {
          renderTile(bounds.tileSize, tile.number);
        }
      });
    });
  };


  this.renderDragLayer = (bounds) => {
    if (drag && !drag.merged) {
      r.transform({
        translate: [drag.pos.x - bounds.tileSize * 0.5,
                    drag.pos.y - bounds.tileSize * 0.5]
      }, () => {
        renderTile(bounds.tileSize, drag.tile.number);
      });
    }
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

export function tileAddDir(dir) {
  return (key) => {
    let pos = key2pos(key);
    let pos2 = [pos[0] + dir[0], pos[1] + dir[1]];
    return pos2key(pos2);
  };
}

export const tileLeft = tileAddDir([-1, 0]);
export const tileRight = tileAddDir([1, 0]);
export const tileUp = tileAddDir([0, -1]);
export const tileDown = tileAddDir([0, 1]);


export function makeTile(number) {
  return {
    number
  };
};

export function incrementTile(tile) {
  return makeTile(tile.number + 1);
};

export function mergable(tile1, tile2) {
  return tile1.number === tile2.number;
};
