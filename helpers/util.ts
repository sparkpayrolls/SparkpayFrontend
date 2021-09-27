import { DebouncedFunc } from "./types";

export class Util {
  static debounce<T extends (...args: any) => any>(
    func: T,
    wait: number
  ): DebouncedFunc<T> {
    let timer: NodeJS.Timeout;
    let shouldInvoke = false;

    const debounced = (...args: any) => {
      clearTimeout(timer);
      if (shouldInvoke) {
        shouldInvoke = false;
        return func(...args);
      }

      timer = setTimeout(() => {
        shouldInvoke = true;
        debounced(...args);
      }, wait);
    };

    return debounced as T;
  }
}
