export default function Events(canvas) {

  let state = this.data = {
    pixelRatio: canvas.pixelRatio,
    bounds: canvas.bounds,
    touches: {}
  };

  this.update = (delta) => {
    let { current } = state;
    if (current) {
      if (current.tapping) {
        if (current.tapping.handled) {
          delete current.tapping;
        } else {
          current.tapping.handled = true;
        }
      }
      if (current.ending) {
        if (current.ending.handled) {
          delete state.current;
        } else {
          current.ending.handled = true;
        }
      }
    }
  };
}


export function bindTouch(state) {
  const unbinds = [];

  const onTouchStart = startTouch(state);
  const onTouchEnd = endTouch(state);
  const onTouchMove = moveTouch(state);

  ['touchstart'].forEach(_ => 
    unbinds.push(unbindable(document, _, onTouchStart)));

  ['touchmove'].forEach(_ => 
    unbinds.push(unbindable(document, _, onTouchMove)));

  ['touchend'].forEach(_ =>
    unbinds.push(unbindable(document, _, onTouchEnd)));

  return () => { unbinds.forEach(_ => _()); };
};

function unbindable(el, eventName, callback) {
  el.addEventListener(eventName, callback);
  return () => el.removeEventListener(eventName, callback);
}

function touchPosition(state, e) {
  let touch = changedTouches(e)[0];

  let touchX = touch.clientX,
      touchY = touch.clientY;

  return {
    css: {
      x: touchX * state.pixelRatio - state.bounds.x,
      y: touchY * state.pixelRatio - state.bounds.y
    },
    device: {
      x: touchX,
      y: touchY
    }
  };
}

function changedTouches(e) {
  return e.changedTouches;
}

function startTouch(state) {
  return function(e) {
    const { css, device } = touchPosition(state, e);

    state.current = {
      tapping: {},
      start: css,
      epos: css,
      epos2: device
    };
  };
}

function moveTouch(state) {
  return function(e) {
    const { css, device } = touchPosition(state, e);

    state.current.epos = css;
    state.current.epos2 = device;
  };
}

function endTouch(state) {
  return function(e) {
    let touches = changedTouches(e);
    let touch = touches[0];
    state.current.ending = {};
  };
}
