import ipol from '../ipol';

export default function Score(r, play) {


  const { width } = r.data;

  const { spikesHeight } = play.data;

  let score;

  let increase;
  let iShadow = new ipol(0.0);
  
  this.init = () => {

    increase = false;
    iShadow.target(0.0);

    score = 0;
  };

  this.update = delta => {
    iShadow.update(delta * 0.01);
    maybeIncrease(delta);
  };

  this.increase = () => {
    increase = true;
    iShadow.target(1.0);
  };

  const maybeIncrease = delta => {
    if (increase && iShadow.settled(0.1)) {
      iShadow.target(0);
      increase = false;
      score++;
    }
  };

  this.render = () => {

    let sOffset = 1 + iShadow.value() * 8;

    r.drawCircle(width * 0.5, spikesHeight * 0.5,
                 spikesHeight * 0.3, '#bbb');

    r.transform({
      translate: [-sOffset, -sOffset]
    }, () => {
      r.drawCircle(width * 0.5, spikesHeight * 0.5,
                   spikesHeight * 0.3, '#ddd');

      r.drawText(width * 0.5, spikesHeight * 0.5,
                 { text: "" + score, size: spikesHeight * 0.3 }, "#bbb");
    });    
  };

}
