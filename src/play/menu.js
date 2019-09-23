import ipol from '../ipol';
import * as co from 'colourz';

export default function Menu(ctx, play) {

  let { canvas: c, renderer: r, assets: a, events: e } = ctx;

  const { width, height } = c;

  const headerHeight = height * 0.05;

  const bgColor = new co.shifter(0xff000000).lum(0.98).base();

  this.data = {
    hMargin: height * 0.01,
    hHeight: height * 0.05,
    hWidth: width,
    
  };
  
  let modes = [new SubMenu(ctx, 'Twenty', 
                           new Twenty(ctx, play, this), 
                           this),
               new SubMenu(ctx, 'Zen', 
                           new Zen(ctx, play, this),
                           this)];

  let openIndex;

  this.init = () => {
    openIndex = 0;
    modes.forEach((_, i) => _.init({ open: i === openIndex }));

  };

  this.select = (item) => {
    let index = modes.indexOf(item);

    if (index === openIndex) {
      return;
    }

    modes[openIndex].close();
    openIndex = index;
    modes[openIndex].open();
  };

  this.update = delta => {

    modes.forEach(_ => _.update(delta));
    
  };

  this.render = () => {

    let topY = 0;


    r.drawText(width * 0.5, headerHeight * 0.6,
               {
                 text: 'Game Modes',
                 align: 'center',
                 baseline: 'center',
                 size: headerHeight * 0.8,
                 weight: '300'
               });

    r.transform({
      translate: [0, headerHeight],
    }, () => {

      modes.forEach(mode => {
        r.transform({
          translate: [0, topY]
        }, () => {
          let { height } = mode.render();

          topY += height;
        });
      });
      
      r.drawRect(0, topY, width, height - topY, bgColor.css());
    });
  };

}

function Twenty(ctx, play, menu) {

  this.render = bgColor =>
  SubPlay(ctx, menu, bgColor,
          'Match tiles to get to twenty.', 
          () => play.state('twenty'));
}

function Zen(ctx, play, menu) {

  this.render = bgColor =>
  SubPlay(ctx, menu, bgColor,
          "Get to twenty at your own pace.", 
          () => play.state('zen'));
}

function SubPlay(ctx, menu, bgColor, subtext, onLogoTap) {

  let { renderer: r, assets: a, events: e } = ctx;

  let { hMargin, hWidth, hHeight } = menu.data;

  let height = hHeight * 2.5;

  r.drawRect(0, 0, hWidth, height, bgColor.css());

  r.drawText(hMargin * 4.0, 0, {
    text: subtext,
    weight: '100',
    align: 'left',
    baseline: 'top',
    size: height * 0.18
  });

  let logoWidth = height * 0.3;

  const bLogo = {
    x: hWidth - logoWidth - hMargin * 4.0,
    y: logoWidth * 0.5,
    width: logoWidth,
    height: logoWidth
  };

  r.checkTapHandler(bLogo, onLogoTap, e);
  r.drawLogo(bLogo, a['icon-play']);

  return { height };  
}

function SubMenu(ctx, header, body, menu) {

  let { renderer: r, assets: a, events: e } = ctx;

  let { hWidth, hMargin, hHeight } = menu.data;

  const textColor = new co.shifter(0xff000000).lum(0.5).base();
  const bgColor = new co.shifter(0xff000000).lum(0.9).base();

  let isOpen,
      closing,
      iOpen = new ipol(0.0);

  this.init = (opts) => {

    opts = {
      open: false,
      ...opts
    };

    closing = false;
    isOpen = opts.open;
    iOpen.both(opts.open?1.0:0.0);

  };

  this.open = () => {
    isOpen = true;
    iOpen.target(1.0);
  };

  this.close = () => {
    closing = true;
    iOpen.target(0.0);
  };

  const onHeaderTap = () => {
    menu.select(this);
  };

  const maybeClose = () => {
    if (closing && iOpen.settled(0.01)) {
      closing = false;
      //  isOpen = false;
    }
  };

  this.update = delta => {
    iOpen.update(delta * 0.01);
    maybeClose();
  };

  this.render = () => {

    let vOpen = iOpen.value();

    let height = hMargin * 2.0 + hHeight;

    bgColor
      .reset()
      .lum(0.95 - vOpen * 0.1);

    textColor
      .reset()
      .lum(0.5 - vOpen * 0.4);

    let bHeader = {
      x: 0,
      y: 0,
      width: hWidth,
      height: height
    };

    r.checkTapHandler(bHeader, onHeaderTap, e);

    r.drawRect(0, 0, hWidth, height, bgColor.css());

    r.drawText(hMargin * 4.0, hMargin, {
      text: header,
      size: hHeight * 0.9,
      weight: 'bold',
      align: 'left',
      baseline: 'top'
    }, textColor.css());


    if (isOpen) {
      r.transform({
        translate: [0, height]
      }, () => {
        let { height: bodyHeight } = body.render(bgColor);
        height += vOpen * bodyHeight;
      });
    }

    return {
      height
    };
  };
}
