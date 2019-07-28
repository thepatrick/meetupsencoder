export const log = (first: unknown, ...rest: unknown[]) => {
  console.log(`${new Date()}: ${first}`, ...rest);
};
