import { objForeach } from 'outilz';
import * as mu from 'mutilz';
import * as co from 'colourz';
import * as rP from '../renderplus';
import { interpolator2 as ipol2 } from '../ipol';
import ipol from '../ipol';

import * as u from './util';

export default function Ground(ctx, play) {
  
  let { canvas: c, renderer: r, assets: a, events: e, colors } = ctx;


  const bGroundF = c.responsiveBounds(({ width, height, pixelRatio }) => {

    let gWidth = width * 0.95,
        tileSize = gWidth / u.cols,
        gHeight = tileSize * u.rows,
        gMargin = (width - gWidth) * 0.5,
        gTopOffset = gHeight * 0.1,
        gBottomOffset = gWidth * 0.25 + gMargin;

    return {
      margin: gMargin,
      x: gMargin,
      y: gMargin + gTopOffset,
      width: gWidth,
      height: gHeight,
      tileSize,
      pixelRatio
    };
  });



  const colBg = colors.darkBackground.copy();

  let tiles;
  let drag;

  this.init = () => {

    tiles = {};

    u.bottomKeys.forEach(key => {
      tiles[key] = new Tile(mu.randInt(1, 5));
    });
  };

  this.liftTiles = () => {
    u.bottomKeys.forEach(key => {
      liftTile(key);
      tiles[key] = new Tile(mu.randInt(1, 5));
    });
  };

  const liftTile = (key) => {
    const upKey = u.tileUp(key);

    if (!tiles[key]) {
      return;
    }

    if (tiles[upKey]) {
      liftTile(upKey);
    }
    if (drag && drag.dest === upKey) {
      const upup = u.tileUp(drag.dest);
      drag.dest = upup;
    }

    tiles[key].lift();
    tiles[upKey] = tiles[key];
    
    delete tiles[key];
  };

  this.update = delta => {
    updateDrag();
    maybeMergeDrag();

    objForeach(tiles, (key, tile) => tile.update(delta));
  };

  const maybeMergeDrag = () => {

    if (drag) {
      let { org, dest, tile: orgTile } = drag;

      let destTile = tiles[dest];

      if (org !== dest && orgTile && destTile && orgTile.mergable(destTile)) {
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
      moveDrag(current.tile, current.epos2);
    }
  };

  const startDrag = (key, pos) => {
    let tile = tiles[key];
    drag = { org: key, dest: key, tile, 
             pos: new ipol2([pos.x, pos.y])
           };
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

  const mergeDrag = () => {

    const { tile, dest } = drag;

    if (dest) {
      tiles[dest] = tile.increment();
    }

    drag.merged = true;
  };

  const moveDrag = (key, pos) => {
    if (drag && !drag.merged) {
      let bounds = bGroundF();

      let newTilePos = u.key2pos(key);

      let oldTilePos = u.key2pos(drag.dest);

      let dPos = [Math.sign(newTilePos[0] - oldTilePos[0]),
                  Math.sign(newTilePos[1] - oldTilePos[1])];


      let dPosH = [oldTilePos[0] + dPos[0], oldTilePos[1]],
          dPosV = [oldTilePos[0], oldTilePos[1] + dPos[1]],
          dPosHV = [dPosH[0], dPosV[1]];

      let tileH = tiles[u.pos2key(dPosH)],
          tileV = tiles[u.pos2key(dPosV)],
          tileHV = tiles[u.pos2key(dPosHV)];

      if (tileHV && tileHV.mergable(drag.tile)) {
      } 
      else if (tileH) { dPosH[0] = oldTilePos[0]; }
      else if (tileV) { dPosV[1] = oldTilePos[1]; }
      else if (tileHV) {
        dPosH[0] = oldTilePos[0];
        dPosV[1] = oldTilePos[1]; 
      }


      let finalPos = [dPosH[0], dPosV[1]];
      let finalKey = u.pos2key(finalPos);


      let dragPosX = bounds.x + finalPos[0] * bounds.tileSize,
          dragPosY = bounds.y + finalPos[1] * bounds.tileSize;


      drag.pos.target([dragPosX, dragPosY]);

      drag.dest = finalKey;

      drag.pos.update(0.7);
    }
  };


  const hitTiles = {
    'left': [[-1, 0.3],
             [-1, -0.7]],
    'right': [[1, 0.3],
              [1, -0.7]],
    'top': [[-0.7, -1],
            [0.3, -1]],
    'bottom': [[-0.7, 1],
               [0.3, 1]]
  };

  this.render = () => {
    let bounds = bGroundF();

    r.transform({
      translate: [bounds.x, bounds.y]
    }, () => {
      renderGround(bounds);
    });


    renderDragLayer(bounds);
    
  };

  const renderNexts = (bounds) => {

    
    
  };

  const renderGround = (bounds) => {
    
    let current = e.data.current;
    if (current) {
      current.hitTiles = {};
    }
    
    u.allPos.forEach(pos => {
      let key = u.pos2key(pos),
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


        let margin = bounds.tileSize * 0.02;
        r.roundedRect(margin, margin,
                      bounds.tileSize - margin * 2.0, 
                      bounds.tileSize - margin * 2.0, bounds.tileSize * 0.2,  colBg.css());


        if (tile) {
          tile.render(r, bounds.tileSize);
        }
      });
    });
  };


  const renderDragLayer = (bounds) => {
    if (drag && !drag.merged) {

      let dragPos = drag.pos.value();

      r.transform({
        translate: [dragPos[0],
                    dragPos[1]]
      }, () => {
        drag.tile.render(r, bounds.tileSize);
      });
    }
  };
}

const tileColours = {
  1: new co.shifter(co.Palette.Mandarin).base(),
  2: new co.shifter(co.Palette.FluRed).base(),
  3: new co.shifter(co.Palette.CelGreen).base(),
  4: new co.shifter(co.Palette.Blue).base(),
  5: new co.shifter(co.Palette.LuckyP).base()
};

function Tile(number) {

  let vOffset = new ipol(0.0);

  this.number = () => number;

  this.mergable = (tile) => tile.number() === number;

  this.increment = () => {
    return new Tile(number + 1);
  };

  this.lift = () => {
    vOffset.value(1.0);    
  };

  this.update = () => {
    vOffset.update(0.1);
  };

  this.render = (r, size) => {

    let margin = size * 0.02;

    let color = tileColours[number];

    const primary = color
          .reset()
          .lum(0.42).css(),
          highlight = color
          .reset()
          .lum(0.62).css(),
          shadow = color
          .reset()
          .lum(0.32).css();

    let offsetY = size * vOffset.value();    

    r.raw(rP.hexa(margin, margin + offsetY,
                  size - margin * 2.0,
                  primary, highlight, shadow));


    r.drawText(size * 0.5, offsetY + size * 0.5, {
      align: 'center',
      baseline: 'middle',
      size: size - margin * 16.0,
      text: number + ""
    }, number === 1 ? 'black': 'white');
  };

}
