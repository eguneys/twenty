export default function Ticker(opts) {
  opts = {
    autoStart: true,
    ...opts
  };

  let { autoStart } = opts;

  let running = autoStart;
  let ticks = 0;
 

  this.running = () => running;

  this.value = (scale = 1) => ticks * scale;

  this.start = () => { running = true; };

  this.stop = () => {
    ticks = 0;
    running = false;
  };

  this.update = delta => {
    if (running) {
      let dt = delta * 0.01;
      ticks += dt;
    }
  };
 

}
