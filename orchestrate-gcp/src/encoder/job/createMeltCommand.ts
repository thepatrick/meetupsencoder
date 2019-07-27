import { flatten } from 'ramda';

export const createMeltCommand = (
  profile: string,
  sources: any,
  outputFilename: string,
  audioCodec = 'aac',
  videoCodec = 'libx264',
): string[] => {
  return [
    '-profile', profile,
  ].concat(flatten(sources))
    .concat([
      '-consumer', `avformat:${outputFilename}`, `acodec=${audioCodec}`, `vcodec=${videoCodec}`,
    ]);
};
