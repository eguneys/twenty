import ipol from '../ipol';

export default function Score(r, play) {

  const { spikesWidth, spikesHeight, spikesMin, colours } = play.data;
  let scoreHeight = spikesMin * 0.2;

  const bgColor = colours.background;

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

  this.score = () => score;

  const maybeIncrease = delta => {
    if (increase && iShadow.settled(0.1)) {
      iShadow.target(0);
      increase = false;
      score++;
    }
  };

  this.render = () => {

    let sOffset = 2 - iShadow.value() * 2.0;

    r.drawCircle(spikesWidth * 0.5, spikesHeight * 0.5,
                 scoreHeight, bgColor.css());

    r.transform({
      translate: [-sOffset, -sOffset]
    }, () => {
      r.drawCircle(spikesWidth * 0.5, spikesHeight * 0.5,
                   scoreHeight, '#ddd');


      if (play.state() === 'play') {
        r.drawText(spikesWidth * 0.5, spikesHeight * 0.5,
                   { text: "" + score, size: scoreHeight }, bgColor.css());
      }
    });    
  };

}
