import { Color } from '../types';

export const colorToHex = (color: Color): `#${string}` => {
  return `#${color[0].toString(16)}${color[1].toString(16)}${color[2].toString(
    16
  )}${color[3].toString(16)}`;
};
