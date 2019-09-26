export const rows = 10;
export const cols = 10;

export const allPos = (function() {
  const res = [];
  for (var i = rows - 1; i > 0; i--) {
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
