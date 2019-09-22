export default function Events(canvas) {

  let state = this.data = {
    bounds: canvas.bounds,
    touches: {}
  };

  this.update = (delta) => {
    let { current } = state;
    if (current) {
      if (current.onetap && !current.onetap.handled) {
        current.onetap.handled = true;
      }
      if (!current.onetap) {
        current.onetap = {
          handled: false
        };
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
    x: touchX - state.bounds.x,
    y: touchY - state.bounds.y
  };
}

function changedTouches(e) {
  return e.changedTouches;
}

function startTouch(state) {
  return function(e) {
    const epos = touchPosition(state, e);

    state.current = {
      start: epos,
      epos
    };
  };
}

function moveTouch(state) {
  return function(e) {
    const epos = touchPosition(state, e);

    state.current.epos = epos;
  };
}

function endTouch(state) {
  return function(e) {
    let touches = changedTouches(e);
    let touch = touches[0];
    delete state.current;
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
