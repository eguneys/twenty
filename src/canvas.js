export default function Canvas(element) {

  const canvas = document.createElement('canvas');

  element.append(canvas);
  const displayWidth = canvas.clientWidth,
        displayHeight = canvas.clientHeight,
        pixelRatio = window.devicePixelRatio || 1;

  this.pixelRatio = pixelRatio;
  this.width = displayWidth;
  this.height = displayHeight;

  canvas.width = displayWidth * pixelRatio;
  canvas.height = displayHeight * pixelRatio;

  this.aspect = this.width / this.height;

  this.canvas = canvas;

  this.bounds = canvas.getBoundingClientRect();

  let memoizes = new WeakMemoizes();

  let listeners = new Listeners();

  this.resize = () => {

    let displayWidth = canvas.clientWidth,
        displayHeight = canvas.clientHeight,
        pixelRatio = window.devicePixelRatio || 1;

    this.pixelRatio = pixelRatio;
    this.width = displayWidth;
    this.height = displayHeight;


    canvas.width = displayWidth * pixelRatio;
    canvas.height = displayHeight * pixelRatio;

    this.aspect = this.width / this.height;

    this.bounds = canvas.getBoundingClientRect();

    memoizes.clear();
    listeners.publish();
  };

  this.addResizeListener = (f) => {
    listeners.subscribe(f);
  };

  this.responsiveBounds = memoizes.setF(this);
};

export function bindResize(canvas) {
  unbindable(window, 'resize', onResize(canvas));
};

function onResize(canvas) {


  return (e) => {
    canvas.resize();
  };
};

function unbindable(el, eventName, callback) {
  el.addEventListener(eventName, callback);
  return () => el.removeEventListener(eventName, callback);
}


// https://stackoverflow.com/questions/58063501/how-to-create-a-dynamic-memoize-function-with-multiple-users-in-javascript
function WeakMemoizes() {

  let cached = new WeakMap();

  this.clear = () => cached = new WeakMap();

  this.setF = (...args) => f => {
    return () => {
      let result = cached.get(f);
      if (result === undefined) {
        cached.set(f, result = f(...args));
      }
      return result;
    };
  };
};

function Listeners() {
  let listeners = [];

  this.publish = () => {
    listeners.forEach(_ => _());
  };

  this.subscribe = f => {
    listeners.push(f);
  };
};
