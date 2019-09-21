export function now() {
  return Date.now();
};

export function ensureDelay(start, fn, delay = 1000) {
  if (now() - start > delay) {
    fn();
  }
};

export function withDelay(fn, delay, updateFn) {
  let lastUpdate = 0;

  return (delta) => {
    lastUpdate += delta;
    if (lastUpdate >= delay) {
      fn();
      lastUpdate = 0;
    } else {
      if (updateFn)
        updateFn(lastUpdate / delay);
    }
  };
};

export function withRandomDelay(fn, delayFn, updateFn) {
  let lastUpdate = 0;

  return (delta) => {
    let delay = delayFn(delta);
    lastUpdate += delta;
    if (lastUpdate >= delay) {
      fn();
      lastUpdate = 0;
    } else {
      if (updateFn)
        updateFn(lastUpdate / delay);
    }
  };
};
