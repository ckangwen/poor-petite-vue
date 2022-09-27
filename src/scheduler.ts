let queued = false;
const queue: Function[] = [];
const p = Promise.resolve();

const flushJobs = () => {
  queue.forEach((job) => {
    job();
  });

  queue.length = 0;
  queued = false;
};

export const nextTick = (fn: () => void) => p.then(fn);

export const queueJob = (job: Function) => {
  if (!queue.includes(job)) {
    queue.push(job);
  }

  if (!queued) {
    queued = true;
    nextTick(flushJobs);
  }
};
