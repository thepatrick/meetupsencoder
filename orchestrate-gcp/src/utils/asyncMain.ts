export const asyncMain: (fn: () => Promise<void>) => void = (fn) => {
  Promise.resolve()
    .then(() => fn())
    .catch((e: any) => {
      console.error(e);
      process.exit(1);
    });
};
