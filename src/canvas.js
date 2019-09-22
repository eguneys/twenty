export default function Canvas(element) {

  const canvas = document.createElement('canvas');

  element.append(canvas);
  const displayWidth = canvas.clientWidth,
        displayHeight = canvas.clientHeight,
        pixelRatio = window.devicePixelRatio || 1;

  this.width = canvas.width = displayWidth;
  this.height = canvas.height = displayHeight;

  this.aspect = this.width / this.height;

  this.canvas = canvas;

  this.bounds = canvas.getBoundingClientRect();
};
