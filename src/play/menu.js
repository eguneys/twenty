import * as co from 'colourz';

export default function Play(r, play) {

  const { width } = r.data;

  const { spikesWidth, spikesHeight, spikesMin, colours } = play.data;

  const primary = colours.background;
  const accent = colours.accent;

  
  let highScore;

  this.init = (opts) => {

    highScore = opts.highScore;
  };

  this.update = delta => {

  };


  this.render = () => {

    let spikeSize = 50;
    let logoSize = spikesHeight * 0.1;
    let tapSize = logoSize * 0.8;
    let topY = spikeSize;

    r.drawText(width * 0.5, topY,
               { text: "DON'T TOUCH", size: logoSize }, primary.css());

    r.drawText(width * 0.5, topY + logoSize,
               { text: "SPIKES", size: logoSize }, primary.css());

    topY = spikesHeight - spikeSize - tapSize;

    r.drawText(width * 0.5, topY,
               { text: "TAP", size: tapSize }, accent.css());
    r.drawText(width * 0.5, topY + tapSize,
               { text: "TO JUMP", size: tapSize }, accent.css());


    if (highScore) {
      let gap = 10;

      let menuWidth = spikesWidth * 0.6,
          menuLeft = spikesWidth * 0.5 - menuWidth * 0.5,
          menuTop = spikeSize + logoSize * 1.8,
          menuHeight = tapSize * (0.6 + 1.6) + gap;

      r.roundedRect(menuLeft, menuTop, menuWidth, menuHeight, 10, accent.css());

      r.drawText(menuLeft + menuWidth * 0.5, 
                 menuTop + gap,
                 { text: "HIGH SCORE",
                   baseline: 'top', 
                   size: tapSize * 0.6 }, 'white');


      r.drawText(menuLeft + menuWidth * 0.5, 
                 menuTop + tapSize * 0.6 + gap,
                 { text: highScore + "",
                   baseline: 'top', 
                   size: tapSize * 1.6 }, 'white');

    }
    
  };

}
