import * as mu from 'mutilz';

export default function DashGen() {

  let seqX;
  let seqY;

  this.init = (bs) => {
    seqX = bs.width * 0.5;
    seqY = 0;
  };
  
  this.gen = (wView, bs) => {
    if (seqY < wView[1] + bs.height) {
      seqY += bs.height * 0.3;

      let opts = {
        x: seqX,
        y: seqY
      };

      seqY += bs.height * 0.1;
      seqX += mu.rand(-bs.width * 0.3, bs.width * 0.3);

      return opts;
    } else {
      return null;
    }
  };

}
