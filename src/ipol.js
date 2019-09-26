export function interpolator2(a, b = a.slice()) {
  return {
    update(dt) {
      a.forEach((_, i) => a[i] = interpolate(a[i], b[i], dt));
    },
    target(x = b) {
      b = x;
      return b;
    },
    settled(threshold = 0.01) {
      return a.every((_, i) => Math.abs(_ - b[i]) < threshold);
    },
    value(x = a) {
      a = x;
      return a;
    }
  };  
}

export default function interpolator(a, b = a) {
  return {
    update(dt) {
      a = interpolate(a, b, dt);
    },
    settled(threshold = 1) {
      return Math.abs(a - b) < threshold;
    },
    both(x = b) {
      a = x;
      b = x;
    },
    target(x = b) {
      b = x;
      return b;
    },
    value(x = a) {
      a = x;
      return a;
    },
  };
}

export function interpolate(a, b, dt = 0.2) {
  return a + (b - a) * dt;
}
