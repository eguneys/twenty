export const ensureDelay = (start, fn, delay = 1000) => {
  if (now() - start > delay) {
    fn();
  }
};

export const withDelay = (fn, delay, updateFn) => {
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

export const withRandomDelay = (fn, delayFn, updateFn) => {
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
