export default function Events(canvas) {

  let state = this.data = {
    bounds: canvas.bounds,
    touches: {}
  };

  const keysByCode = {
    'Space': 'space',
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
  };

  const keys = Object.values(keysByCode);

  this.update = (delta) => {
    keys.forEach(key => {
      if (state[key] || state[key] === 0) {
        state[key] += delta * 0.01;
      }
    });
  };
}

export function bindKeyboard(state) {
  const unbinds = [];

  const onKeyDown = startMove(state);
  const onKeyUp = endMove(state);

  unbinds.push(unbindable(document, 'keydown', onKeyDown));
  unbinds.push(unbindable(document, 'keyup', onKeyUp));

  return () => { unbinds.forEach(_ => _()); };
};


export function bindTouch(state) {
  const unbinds = [];

  const onTouchStart = startTouch(state);
  const onTouchEnd = endTouch(state);

  ['touchstart'].forEach(_ => 
    unbinds.push(unbindable(document, _, onTouchStart)));

  ['touchend'].forEach(_ =>
    unbinds.push(unbindable(document, _, onTouchEnd)));

  return () => { unbinds.forEach(_ => _()); };
};

function unbindable(el, eventName, callback) {
  el.addEventListener(eventName, callback);
  return () => el.removeEventListener(eventName, callback);
}

function makePress(state) {
  return key => {
    if (!state[key]) {
      state[key] = 0;
    }
  };
}

function makeRelease(state) {
  return key => {
    delete state[key];
  };
}

function touchPosition(state, touch) {
  let touchX = touch.clientX,
      touchY = touch.clientY;

  return {
    x: touchX - state.bounds.x,
    y: touchY - state.bounds.y
  };
}

function changedTouches(e) {
  return e.changedTouches;
}

function touchAction(state, pos) {
  const { width, height } = state.bounds;

  const halfW = width * 0.5,
        halfH = height * 0.5;

  if (pos.x < halfW) {
    if (pos.y > halfH) {
      return 'leftbottom';
    } else {
      return 'lefttop';
    }
  } else {
    if (pos.y > halfH) {
      return 'rightbottom';
    } else {
      return 'righttop';
    }
  }
  
}

function startTouch(state) {
  const press = makePress(state);

  const pressAndSave = (key, id) => {
    state.touches[id] = key;
    press(key);
  };

  return function(e) {
    let touches = changedTouches(e);

    for (let i = 0; i < touches.length; i++) {
      let touch = touches[i];      
      const pos = touchPosition(state, touch);
      const id = touch.identifier;

      const action = touchAction(state, pos);
      switch (action) {
      case 'leftbottom':
        pressAndSave('left', id);
        break;
      case 'rightbottom':
        pressAndSave('right', id);
        break;
      case 'lefttop':
        pressAndSave('up', id);
        break;
      case 'righttop':
        pressAndSave('up', id);
        break;
      }
    }
  };
}

function endTouch(state) {
  const release = makeRelease(state);

  function releaseAndSave(id) {
    release(state.touches[id]);
    delete state.touches[id];
  }

  return function(e) {
    let touches = changedTouches(e);
    for (let i = 0; i < touches.length; i++) {
      let touch = touches[i];
      let id = touch.identifier;
      releaseAndSave(id);
    }
  };
}

function startMove(state) {
  const press = makePress(state);

  return function(e) {

    switch(e.code) {
    case 'Space':
      press('space');
      break;
    case 'ArrowUp':
      press('up');
      break;
    case 'ArrowDown':
      press('down');
      break;
    case 'ArrowLeft':
      press('left');
      break;
    case 'ArrowRight':
      press('right');
      break;
    default:
      return;
    }
    e.preventDefault();
  };
}


function endMove(state) {
  const release = makeRelease(state);
  return function(e) {
    switch (e.code) {
    case 'Space':
      release('space');
      break;
    case 'ArrowUp':
      release('up');
      break;
    case 'ArrowDown':
      release('down');
      break;
    case 'ArrowLeft':
      release('left');
      break;
    case 'ArrowRight':
      release('right');
      break;
    }
  };
}
