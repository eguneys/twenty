import * as co from 'colourz';

export default function Colors() {
  return {
    background: new co.shifter(co.Palette.CrocTooth).lum(0.9),
    darkBackground: new co.shifter(co.Palette.CrocTooth).lum(0.5)
  };
};
