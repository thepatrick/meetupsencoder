export const isNonEmptyString = (possible: unknown): possible is String => {
  return typeof possible === 'string' &&
    possible.length > 0;
};
