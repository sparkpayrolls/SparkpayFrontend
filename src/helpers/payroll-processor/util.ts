import { Util as AppUtil } from 'src/helpers/util';
import { Addon } from './types';

export class Util extends AppUtil {
  static sumAddons(addons: Addon[], precision: number) {
    return this.getPreciseNumber(
      addons.reduce((acc, cur) => acc + cur.amount, 0),
      precision,
    );
  }
}
