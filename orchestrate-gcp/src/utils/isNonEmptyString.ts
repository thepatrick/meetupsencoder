export const isNonEmptyString = (possible: unknown): possible is string => {
  console.log('isNonEmptyString', possible, typeof possible, (possible as string).length);
  return typeof possible === 'string' &&
    possible.length > 0;
};
