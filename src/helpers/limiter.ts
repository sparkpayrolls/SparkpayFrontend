/**
 * Returns a scheduler that runs at most `concurrency` tasks at a time and
 * queues the rest in order.
 */
export const createLimiter = (concurrency: number) => {
  let active = 0;
  const waiting: (() => void)[] = [];

  const next = () => {
    if (active >= concurrency) {
      return;
    }
    const run = waiting.shift();
    if (run) {
      active += 1;
      run();
    }
  };

  return <T>(task: () => Promise<T>) =>
    new Promise<T>((resolve, reject) => {
      waiting.push(() => {
        task()
          .then(resolve, reject)
          .finally(() => {
            active -= 1;
            next();
          });
      });
      next();
    });
};
